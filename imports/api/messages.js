import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { GroupsDB } from "./groups";

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

        return MessagesDB.find({ groupId }, { sort: { sentAt: 1 } });
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
        return MessagesDB.insert(
            {
                groupId: partialMsg.groupId,
                content: partialMsg.content,
                userId: this.userId,
                userName: Meteor.user().displayName,
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
