import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { ProfilesDB } from "./profiles";
import { checkUserExist } from "../methods/methods";

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

        return MessagesDB.find({ groupId }, { limit: 100 });
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
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        // For API tests only
        if (!userDisplayName) {
            userDisplayName = ProfilesDB.findOne({ _id: this.userId })
                .displayName;
        }

        validatePartialMsg(partialMsg, userDisplayName);

        const now = moment().valueOf();
        return (result = MessagesDB.insert({
            groupId: partialMsg.groupId,
            content: partialMsg.content,
            userId: this.userId,
            userDisplayName,
            sentAt: now
        }));
    }
});
