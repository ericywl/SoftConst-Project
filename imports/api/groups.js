import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { checkAccess, checkUserExist, tagFilter } from "../methods/methods";

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
        checkUserExist(Meteor.userId());

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
     * @param {String} _id : id of the group to be removed
     */
    groupsRemove(_id) {
        checkAccess(_id, GroupsDB);

        return GroupsDB.remove({ _id });
    },

    /**
     * Add tag to a group
     * @param {String} _id : id of the group
     * @param {String} tag : tag to be inserted
     */
    groupsAddTag(_id, tag) {
        checkAccess(_id, GroupsDB);
        const formattedTag = tagFilter(tag);

        return GroupsDB.update({ _id }, { $addToSet: { tags: formattedTag } });
    },

    /**
     * Remove tag from the group identified by id if exists
     * @param {String} _id : id of the group
     * @param {String} tag : tag to be removed
     */
    groupsRemoveTag(_id, tag) {
        checkAccess(_id, GroupsDB);
        const formattedTag = tagFilter(tag);

        if (!GroupsDB.findOne({ _id, tags: formattedTag })) {
            throw new Meteor.Error("tag-not-found");
        }

        return GroupsDB.update({ _id }, { $pull: { tags: formattedTag } });
    },

    /**
     * Add userId to the list of group moderators
     * @param {String} _id : id of the group
     * @param {String} userId : id of the user
     */
    groupsAddModerator(_id, userId) {
        checkAccess(_id, GroupsDB);
        checkUserExist(userId);

        return GroupsDB.update({ _id }, { $push: { moderators: userId } });
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

const validateNewGroup = partialGroup => {
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

    return true;
};
