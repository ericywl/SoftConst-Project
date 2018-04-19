// Library
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

// API
import { ProfilesDB } from "./profiles";
import { GroupsDB } from "./groups";
import {
    checkUserExist,
    checkAccess,
    validateMessage,
    validateUserDisplayName
} from "../misc/methods";

export const GroupsMessagesDB = new Mongo.Collection("groupsMessages");

if (Meteor.isServer) {
    Meteor.publish("messagesByGroup", function(groupId) {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        new SimpleSchema({
            groupId: { type: String }
        }).validate({ groupId });

        return GroupsMessagesDB.find({ groupId }, { limit: 500 });
    });
}

Meteor.methods({
    groupsMessagesInsert(partialMsg) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(this.userId);

        const userDisplayName = ProfilesDB.findOne({ _id: this.userId })
            .displayName;

        validateUserDisplayName(userDisplayName);
        validateMessage("groups", partialMsg);

        const now = moment().valueOf();
        const result = GroupsMessagesDB.insert(
            {
                groupId: partialMsg.groupId,
                room: partialMsg.room,
                content: partialMsg.content,
                userId: this.userId,
                userDisplayName,
                sentAt: now
            },
            err => {
                if (!err) {
                    try {
                        GroupsDB.update(
                            { _id: partialMsg.groupId },
                            { $set: { lastMessageAt: now } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    groupsMessagesWelcome(groupId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(this.userId);

        const userDisplayName = ProfilesDB.findOne({ _id: this.userId })
            .displayName;

        validateUserDisplayName(userDisplayName);

        const now = moment().valueOf();
        const result = GroupsMessagesDB.insert(
            {
                groupId: groupId,
                room: "messages",
                content: `${userDisplayName} has joined the group!`,
                userId: this.userId,
                userDisplayName: "",
                sentAt: now
            },
            err => {
                if (!err) {
                    try {
                        GroupsDB.update(
                            { _id: groupId },
                            { $set: { lastMessageAt: now } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    groupsMessagesRemove(messageId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        const message = GroupsMessagesDB.findOne({ _id: messageId });
        if (!message) throw new Meteor.Error("message-does-not-exist");

        if (message.userId !== this.userId) {
            if (!checkAccess(message.groupId, GroupsDB))
                throw new Meteor.Error("not-sender");
        }

        return GroupsMessagesDB.remove({ _id: messageId });
    }
});
