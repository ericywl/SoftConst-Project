import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import {
    checkAccess,
    checkUserExist,
    tagFilter,
    validateGroup,
    validateGroupName
} from "../misc/methods";

export const GroupsDB = new Mongo.Collection("groups");

if (Meteor.isServer) {
    Meteor.publish("groups", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        return GroupsDB.find(
            {},
            {
                fields: {
                    name: 1,
                    lastMessageAt: 1,
                    tags: 1,
                    moderators: 1,
                    isPrivate: 1
                },
                $limit: 100
            }
        );
    });
}

Meteor.methods({
    /**
     * Add group to database with a partialGroup object
     * @param {Object} partialGroup : includes name, description and isPrivate
     */
    groupsInsert(partialGroup) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateGroup(partialGroup);

        return GroupsDB.insert({
            name: partialGroup.name,
            description: partialGroup.description,
            isPrivate: partialGroup.isPrivate,
            tags: [],
            lastMessageAt: moment().valueOf(),
            createdAt: moment().valueOf(),
            createdBy: Meteor.userId(),
            moderators: [Meteor.userId()]
        });
    },

    /**
     * Remove group from database
     * @param {String} groupId : id of the group to be removed
     */
    groupsRemove(groupId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(groupId, GroupsDB);

        return GroupsDB.remove({ _id: groupId });
    },

    /**
     * Add tag to a group
     * @param {String} groupId : id of the group
     * @param {String} tag : tag to be inserted
     */
    groupsAddTag(groupId, tag) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(groupId, GroupsDB);
        const formattedTag = tagFilter(tag);

        return GroupsDB.update(
            { _id: groupId },
            { $addToSet: { tags: formattedTag } }
        );
    },

    /**
     * Remove tag from the group identified by id if exists
     * @param {String} groupId : id of the group
     * @param {String} tag : tag to be removed
     */
    groupsRemoveTag(groupId, tag) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(groupId, GroupsDB);
        const formattedTag = tagFilter(tag);

        if (!GroupsDB.findOne({ _id: groupId, tags: formattedTag })) {
            throw new Meteor.Error("tag-not-found");
        }

        return GroupsDB.update(
            { _id: groupId },
            { $pull: { tags: formattedTag } }
        );
    },

    /**
     * Add userId to the list of group moderators
     * @param {String} groupdId : id of the group
     * @param {String} userId : id of the user
     */
    groupsAddModerator(groupdId, userId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(userId);
        checkAccess(groupdId, GroupsDB);

        return GroupsDB.update(
            { _id: groupdId },
            { $push: { moderators: userId } }
        );
    },

    /**
     * Change the group name
     * @param {String} groupdId : id of the group
     * @param {String} newName : the group's new name
     */
    groupsChangeName(groupdId, newName) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateGroupName(newName);
        checkAccess(groupdId, GroupsDB);

        return GroupsDB.update({ _id: groupdId }, { $set: { name: newName } });
    },

    /**
     * Update last message at, called only when messages are inserted
     * @param {String} _id : id of the group
     * @param {Number} time : time of last message
     */
    groupsUpdateLastMessageAt(_id, time) {
        return GroupsDB.update({ _id }, { $set: { lastMessageAt: time } });
    }
});
