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
    /**
     * Add group to database with a name
     * TODO: check for roles before adding
     * @param {String} name
     */
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

    /**
     * Remove group from database via groupId
     * TODO: check for roles before removing
     * @param {String} _id
     */
    groupsRemove(_id) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return GroupsDB.remove({ _id });
    },

    groupsAddTag(_id, tag) {
        const formattedTag = tag.trim();
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        return GroupsDB.update({ _id }, { $addToSet: { tags: formattedTag } });
    },

    groupsRemoveTag(_id, tag) {
        const formattedTag = tag.trim();
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        if (!GroupsDB.findOne({ _id, tags: formattedTag })) {
            throw new Meteor.Error("tag-not-found");
        }

        return GroupsDB.update({ _id }, { $pull: { tags: formattedTag } });
    }
});
