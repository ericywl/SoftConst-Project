import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

export const MessagesDB = new Mongo.Collection("messages");

if (Meteor.isServer) {
    Meteor.publish("messagesByRoom", function(roomId) {
        return MessagesDB.find({ roomId }, { sort: { sentAt: 1 } });
    });
}

Meteor.methods({
    messagesInsert(partialMsg) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return MessagesDB.insert({
            roomId: partialMsg.roomId,
            content: partialMsg.content,
            userId: this.userId,
            userName: Meteor.user().profile.displayName,
            sentAt: moment().valueOf()
        });
    }
});
