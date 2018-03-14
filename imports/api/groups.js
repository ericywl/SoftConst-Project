import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { ProfilesDB } from "./profiles";
import { checkAuth, checkUserExist } from "../methods/methods";

export const GroupsDB = new Mongo.Collection("groups");

if (Meteor.isServer) {
    Meteor.publish("groups", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-authorized");
        }

        return GroupsDB.find(
            {},
            {
                fields: { name: 1, lastMessageAt: 1, tags: 1, moderators: 1 }
            }
        );
    });
}

Meteor.methods({
    /**
     * Add group to database with a name
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
            moderators: [this.userId],
            lastMessageAt: moment().valueOf(),
            createdBy: this.userId
        });
    },

    /**
     * Remove group from database via groupId
     * @param {String} _id: id of the group
     */
    groupsRemove(_id) {
        checkAuth(_id, GroupsDB);

        return GroupsDB.remove({ _id });
    },

    /**
     * Add tag to the group identified by groupId
     * TODO: check for roles before adding
     * @param {String} _id: id of the group
     * @param {String} tag: tag to be inserted
     */
    groupsAddTag(_id, tag) {
        checkAuth(_id, GroupsDB);
        const formattedTag = tag.trim();

        return GroupsDB.update({ _id }, { $addToSet: { tags: formattedTag } });
    },

    /**
     * Remove tag from the group identified by groupId if exists
     * @param {String} _id: id of the group
     * @param {String} tag: tag to be removed
     */
    groupsRemoveTag(_id, tag) {
        checkAuth(_id, GroupsDB);
        const formattedTag = tag.trim();

        if (!GroupsDB.findOne({ _id, tags: formattedTag })) {
            throw new Meteor.Error("tag-not-found");
        }

        return GroupsDB.update({ _id }, { $pull: { tags: formattedTag } });
    },

    /**
     * Add userId to the list of group moderators
     * @param {String} _id: id of the group
     * @param {String} userId: id of the user
     */
    groupsAddModerator(_id, userId) {
        checkAuth(_id, GroupsDB);
        checkUserExist(userId);

        return GroupsDB.update({ _id }, { $push: { moderators: userId } });
    },

    /**
     * Update last message at, called only when messages are inserted
     * @param {String} _id: id of the group
     * @param {Number} time: time of last message
     */
    groupsUpdateLastMessageAt(_id, time) {
        return GroupsDB.update({ _id }, { $set: { lastMessageAt: time } });
    }
});
