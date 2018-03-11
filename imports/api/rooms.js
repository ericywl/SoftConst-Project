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

    roomsAddMessage(_id, message) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return RoomsDB.update(
            { _id },
            {
                $push: {
                    messages: message._id
                },
                $set: {
                    lastMessageAt: moment().valueOf()
                }
            }
        );
    }
});
