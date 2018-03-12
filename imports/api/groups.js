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
    groupsInsert(partialGroup) {
        if (!this.userId) throw new Meteor.Error("not-authorized");

        new SimpleSchema({
            name: {
                type: String,
                min: 3,
                max: 30
            },
            description: {
                type: String,
                max: 50
            },
            isPrivate: {
                type: Boolean
            }
        }).validate({
            name: partialGroup.name,
            description: partialGroup.description,
            isPrivate: partialGroup.isPrivate
        });

        return GroupsDB.insert({
            name: partialGroup.name,
            description: partialGroup.description,
            isPrivate: partialGroup.isPrivate,
            tags: [],
            lastMessageAt: moment().valueOf(),
            createdBy: this.userId
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

    /**
     * Add tag to the group identified by groupId
     * TODO: check for roles before adding
     * @param {String} _id
     * @param {String} tag
     */
    groupsAddTag(_id, tag) {
        const formattedTag = tag.trim();
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        if (!GroupsDB.findOne({ _id })) {
            throw new Meteor.Error("group-not-found");
        }

        return GroupsDB.update({ _id }, { $addToSet: { tags: formattedTag } });
    },

    /**
     * Remove tag from the group identified by groupId if exists
     * @param {String} _id
     * @param {String} tag
     */
    groupsRemoveTag(_id, tag) {
        const formattedTag = tag.trim();
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        if (!GroupsDB.findOne({ _id })) {
            throw new Meteor.Error("group-not-found");
        }

        if (!GroupsDB.findOne({ _id, tags: formattedTag })) {
            throw new Meteor.Error("tag-not-found");
        }

        return GroupsDB.update({ _id }, { $pull: { tags: formattedTag } });
    }
});
