import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

// APIs
import { ProfilesDB } from "./profiles";
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
                    ownedBy: 1,
                    moderators: 1,
                    members: 1
                },
                $limit: 100
            }
        );
    });
}

Meteor.methods({
    /**
     * Add group to database with a partialGroup object
     * @param {Object} partialGroup : includes name, description
     */
    groupsInsert(partialGroup) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateGroup(partialGroup);

        const res = GroupsDB.insert(
            {
                name: partialGroup.name,
                description: partialGroup.description,
                tags: [],
                lastMessageAt: moment().valueOf(),
                createdAt: moment().valueOf(),
                ownedBy: this.userId,
                moderators: [],
                members: []
            },
            (err, groupId) => {
                if (!err) {
                    try {
                        ProfilesDB.update(
                            { _id: this.userId },
                            { $push: { groups: groupId } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                }
            }
        );

        return res;
    },

    /**
     * Remove group from database
     * @param {String} groupId : id of the group to be removed
     */
    groupsRemove(groupId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        const accessLevel = checkAccess(groupdId, GroupsDB);
        if (accessLevel !== "high")
            throw new Meteor.Error("high-level-access-required");

        const group = GroupsDB.findOne({ _id: groupId });
        const canRemoveGroup =
            group.members.length === 1 && group.members.includes(this.userId);

        if (!canRemoveGroup)
            throw new Meteor.Error("cannot-remove-group-with-members");

        return GroupsDB.remove({ _id: groupId });
    },

    /**
     * Add tag to a group
     * @param {String} groupId : id of the group
     * @param {String} tag : tag to be inserted
     */
    groupsTagAdd(groupId, tag) {
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
    groupsTagRemove(groupId, tag) {
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
     * Only the owner can add moderators
     * @param {String} groupdId : id of the group
     * @param {String} userId : id of the user
     */
    groupsModeratorAdd(groupdId, userId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(userId);
        const accessLevel = checkAccess(groupdId, GroupsDB);
        if (accessLevel !== "high")
            throw new Meteor.Error("high-level-access-required");

        return GroupsDB.update(
            { _id: groupdId },
            { $push: { moderators: userId } }
        );
    },

    /**
     * Remove userId from the list of group moderators
     * Only the owner can remove moderators
     * @param {String} groupId: id of the group
     * @param {String} userId: id of the user
     */
    groupsModeratorRemove(groupdId, userId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(userId);
        const accessLevel = checkAccess(groupdId, GroupsDB);
        if (accessLevel !== "high")
            throw new Meteor.Error("high-level-access-required");

        return GroupsDB.update(
            { _id: groupdId },
            { $pull: { moderators: userId } }
        );
    },

    /**
     * Change the group name
     * @param {String} groupdId : id of the group
     * @param {String} newName : the group's new name
     */
    groupsNameChange(groupdId, newName) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateGroupName(newName);
        checkAccess(groupdId, GroupsDB);

        return GroupsDB.update({ _id: groupdId }, { $set: { name: newName } });
    }
});
