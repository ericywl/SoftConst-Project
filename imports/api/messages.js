import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

export const MessagesDB = new Mongo.Collection("messages");

if (Meteor.isServer) {
    Meteor.publish("messagesByGroup", function(groupId) {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-authorized");
        }

        new SimpleSchema({
            groupId: { type: String }
        }).validate({ groupId });

        return MessagesDB.find({ groupId });
    });
}

const validatePartialMsg = (partialMsg, userDisplayName) => {
    new SimpleSchema({
        groupId: { type: String },
        content: { type: String },
        userDisplayName: {
            type: String,
            min: 2,
            max: 30
        }
    }).validate({
        groupId: partialMsg.groupId,
        content: partialMsg.content,
        userDisplayName
    });

    return true;
};

Meteor.methods({
    messagesInsert(partialMsg, userDisplayName = undefined) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        // For API tests only
        if (!userDisplayName) {
            userDisplayName = ProfilesDB.findOne({ _id: this.userId })
                .displayName;
        }

        validatePartialMsg(partialMsg, userDisplayName);

        const now = moment().valueOf();
        try {
            const result = MessagesDB.insert({
                groupId: partialMsg.groupId,
                content: partialMsg.content,
                userId: this.userId,
                userDisplayName,
                sentAt: now
            });

            Meteor.call("groupsUpdateLastMessageAt", partialMsg.groupId, now);
            return result;
        } catch (err) {
            throw new Meteor.Error("messages-insert-failed");
        }
    }
});
