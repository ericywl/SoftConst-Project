import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

export const MessagesDB = new Mongo.Collection("messages");

if (Meteor.isServer) {
    Meteor.publish("messagesByGroup", function(groupId) {
        return MessagesDB.find({ groupId }, { sort: { sentAt: 1 } });
    });
}

Meteor.methods({
    messagesInsert(partialMsg) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return MessagesDB.insert({
            groupId: partialMsg.groupId,
            content: partialMsg.content,
            userId: this.userId,
            userName: Meteor.user().displayName,
            sentAt: moment().valueOf()
        });
    }
});
