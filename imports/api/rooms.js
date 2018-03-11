import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

export const RoomsDB = new Mongo.Collection("rooms");

if (Meteor.isServer) {
    Meteor.publish("roomsDB", function() {
        return RoomsDB.find();
    });
}

Meteor.methods({
    roomsInsert(name = "new room") {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return RoomsDB.insert({
            name,
            messages: [],
            lastMessageAt: moment().valueOf()
        });
    },

    roomsAddMessage(_id, messageBody) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        const message = {
            userId: this.userId,
            content: messageBody,
            sentAt: moment().valueOf()
        };

        return RoomsDB.update(
            { _id },
            {
                $push: {
                    messages: message
                },
                $set: {
                    lastMessageAt: moment().valueOf()
                }
            }
        );
    }
});
