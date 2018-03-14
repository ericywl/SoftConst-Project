import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { ProfilesDB } from "./profiles";
import { checkAccess, checkUserExist, tagFilter } from "../methods/methods";

export const GroupsDB = new Mongo.Collection("groups");
export const CurrGroupsDB = new Mongo.Collection("currentGroups");
export const PublicGroupsDB = new Mongo.Collection("publicGroups");

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
                    createdAt: 1,
                    tags: 1,
                    isPrivate: 1,
                    moderators: 1,
                    members: 1
                }
            }
        );
    });

    Meteor.publish("publicGroups", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        Mongo.Collection._publishCursor(
            GroupsDB.find(
                { isPrivate: false },
                {
                    fields: {
                        name: 1,
                        lastMessageAt: 1,
                        createdAt: 1,
                        tags: 1,
                        isPrivate: 1
                    },
                    sort: { lastMessageAt: -1 },
                    limit: 10
                }
            ),
            this,
            "publicGroups"
        );
    });

    Meteor.publish("currentGroups", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        const profile = ProfilesDB.findOne({ _id: this.userId });

        Mongo.Collection._publishCursor(
            GroupsDB.find(
                { _id: { $in: profile.groups } },
                {
                    fields: {
                        name: 1,
                        lastMessageAt: 1,
                        createdAt: 1,
                        tags: 1,
                        moderators: 1,
                        members: 1,
                        isPrivate: 1
                    }
                }
            ),
            this,
            "currentGroups"
        );
        this.ready();
    });
}

Meteor.methods({
    /**
     * Add group to database with a partialGroup object
     * @param {Object} partialGroup : includes name, description and isPrivate
     */
    groupsInsert(partialGroup) {
        if (!Meteor.userId()) throw new Meteor.Error("not-logged-in");

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
            createdAt: moment().valueOf(),
            createdBy: Meteor.userId(),
            moderators: [Meteor.userId()],
            members: []
        });
    },

    /**
     * Remove group from database
     * @param {String} _id : id of the group to be removed
     */
    groupsRemove(_id) {
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
            checkGroupExist(_id);
            checkAccess(_id, GroupsDB);
        }

        return GroupsDB.remove({ _id });
    },

    /**
     * Add tag to a group
     * @param {String} _id : id of the group
     * @param {String} tag : tag to be inserted
     */
    groupsAddTag(_id, tag) {
        if (Meteor.isServer) {
            checkGroupExist(_id);
            checkUserExist(Meteor.userId());
            checkAccess(_id, GroupsDB);
        }

        const formattedTag = tagFilter(tag);
        return GroupsDB.update({ _id }, { $addToSet: { tags: formattedTag } });
    },

    /**
     * Remove tag from the group identified by groupId if exists
     * @param {String} _id : id of the group
     * @param {String} tag : tag to be removed
     */
    groupsRemoveTag(_id, tag) {
        if (Meter.isServer) {
            checkUserExist(Meteor.userId());
            checkGroupExist(_id);
            checkAccess(_id, GroupsDB);
        }

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
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
            checkUserExist(userId);
            checkGroupExist(_id);
            checkAccess(_id, GroupsDB);
        }

        if (!GroupsDB.findOne({ _id }).members.includes(userId)) {
            throw new Meteor.Error("user-not-in-group");
        }

        return GroupsDB.update({ _id }, { $push: { moderators: userId } });
    },

    groupsAddMemberPublic(_id, userId) {
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
            checkUserExist(userId);
            checkGroupExist(_id);
        }

        if (!GroupsDB.findOne({ _id }).members.includes(userId)) {
            throw new Meteor.Error("already-in-group");
        }

        return GroupsDB.update({ _id }, { $push: { members: userId } });
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

const checkGroupExist = _id => {
    if (!GroupsDB.findOne({ _id })) {
        throw new Meteor.Error("group-not-found");
    }
};
