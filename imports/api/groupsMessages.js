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

        return GroupsMessagesDB.find({ groupId });
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

    groupsMessagesStatus(groupId, status, targetUserId = "") {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(this.userId);

        let userDisplayName;
        if (targetUserId !== "") {
            userDisplayName = ProfilesDB.findOne({ _id: targetUserId })
                .displayName;
        } else {
            userDisplayName = ProfilesDB.findOne({ _id: this.userId })
                .displayName;
        }

        validateUserDisplayName(userDisplayName);
        let content;
        if (status.toLowerCase() === "leave") {
            content = `${userDisplayName} has left the group!`;
        } else if (status.toLowerCase() === "join") {
            content = `${userDisplayName} has joined the group!`;
        } else if (status.toLowerCase() === "kick") {
            content = `${userDisplayName} has been kicked from the group!`;
        } else {
            throw new Meteor.Error("invalid-status");
        }

        console.log(content);
        const now = moment().valueOf();
        const result = GroupsMessagesDB.insert(
            {
                groupId: groupId,
                room: "messages",
                content,
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
