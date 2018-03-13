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

Meteor.methods({
    messagesInsert(partialMsg) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        new SimpleSchema({
            groupId: { type: String },
            content: { type: String }
        }).validate({
            groupId: partialMsg.groupId,
            content: partialMsg.content
        });

        const now = moment().valueOf();
        const userDisplayName = ProfilesDB.findOne({ _id: this.userId })
            .displayName;

        return MessagesDB.insert(
            {
                groupId: partialMsg.groupId,
                content: partialMsg.content,
                userId: this.userId,
                userDisplayName,
                sentAt: now
            },
            (err, res) => {
                if (!err) {
                    GroupsDB.update(
                        { _id: partialMsg.groupId },
                        { $set: { lastMessageAt: now } }
                    );
                }
            }
        );
    }
});
