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
    messagesInsert(content) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return MessagesDB.insert({
            content,
            senderId: this.userId,
            sentAt: moment().valueOf()
        });
    }
});
