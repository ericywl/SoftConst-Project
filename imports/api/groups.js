import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

export const GroupsDB = new Mongo.Collection("groups");

if (Meteor.isServer) {
    Meteor.publish("groups", function() {
        return GroupsDB.find();
    });
}

Meteor.methods({
    groupsInsert(name = "new group") {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return GroupsDB.insert({
            name,
            tags: [],
            isPrivate: false,
            lastMessageAt: moment().valueOf()
        });
    },

    groupsAddTags(_id, tag) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return GroupsDB.update({ _id }, { $push: { tags: tag } });
    }
});
