import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

export const MessagesDB = new Mongo.Collection("messages");

if (Meteor.isServer) {
    Meteor.publish("messagesDB", function() {
        return MessagesDB.find();
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
            senderId: this.userId,
            sentAt: moment().valueOf()
        });
    }
});
