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

export const MessagesDB = new Mongo.Collection("messages");

if (Meteor.isServer) {
    Meteor.publish("messagesByGroup", function(groupId) {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        new SimpleSchema({
            groupId: { type: String }
        }).validate({ groupId });

        return MessagesDB.find({ groupId }, { limit: 500 });
    });
}

Meteor.methods({
    messagesInsert(partialMsg) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(this.userId);

        const userDisplayName = ProfilesDB.findOne({ _id: this.userId })
            .displayName;

        validateMessage(partialMsg);
        validateUserDisplayName(userDisplayName);

        const now = moment().valueOf();
        const result = MessagesDB.insert(
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
                    } catch (err) {
                        throw err;
                    }
                }
            }
        );

        return result;
    }
});
