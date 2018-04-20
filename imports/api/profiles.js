// Library
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

// APIs
import { GroupsDB } from "./groups";
import { DsbjsDB } from "./dsbjs";
import {
    checkUserExist,
    validateUserDisplayName,
    validateUserBio
} from "../misc/methods";
import { ROOM_TEXT_ARR, USERNAME_MIN_LENGTH } from "../misc/constants";

export const ProfilesDB = new Mongo.Collection("profiles");

if (Meteor.isServer) {
    Meteor.publish("profiles", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        return ProfilesDB.find();
    });
}

Meteor.methods({
    profilesJoinGroup(groupId) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }
        checkUserExist(this.userId);

        const group = GroupsDB.findOne({ _id: groupId });
        if (!group)
            throw new Meteor.Error(
                "list-does-not-exist",
                "The list specified does not exist"
            );

        if (group.ownedBy === this.userId)
            throw new Meteor.Error(
                "already-in-list",
                "You are already the owner of that list"
            );

        const profile = ProfilesDB.findOne({ _id: this.userId });
        if (
            group.members.includes(this.userId) ||
            profile.groups.includes(groupId)
        ) {
            throw new Meteor.Error(
                "already-in-list",
                "You are already in that list"
            );
        }

        try {
            const result = ProfilesDB.update(
                { _id: this.userId },
                { $addToSet: { groups: groupId } }
            );

            GroupsDB.update(
                { _id: groupId },
                { $addToSet: { members: this.userId } }
            );

            return result;
        } catch (err) {
            throw err;
        }
    },

    profilesLeaveGroup(groupId) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }
        checkUserExist(this.userId);

        const group = GroupsDB.findOne({ _id: groupId });
        if (!group)
            throw new Meteor.Error(
                "list-does-not-exist",
                "The list specified does not exist"
            );

        if (group.ownedBy === this.userId && group.members.length !== 0) {
            throw new Meteor.Error(
                "owner-cannot-leave-non-empty-list",
                "Owner cannot leave if group is not empty"
            );
        } else if (
            group.ownedBy === this.userId &&
            group.members.length === 0
        ) {
            const result = ProfilesDB.update(
                { _id: this.userId },
                { $pull: { groups: groupId } },
                err => {
                    if (!err) {
                        try {
                            GroupsDB.remove({ _id: groupId });
                        } catch (newErr) {
                            throw newErr;
                        }
                    } else {
                        throw err;
                    }
                }
            );

            return result;
        }

        if (
            !group.members.includes(this.userId) &&
            !group.moderators.includes(this.userId)
        ) {
            throw new Meteor.Error("not-in-list", "You are not in that list");
        }

        const profile = ProfilesDB.findOne({ _id: this.userId });
        if (!profile.groups.includes(groupId)) {
            throw new Meteor.Error("not-in-list", "You are not in that list");
        }

        const result = ProfilesDB.update(
            { _id: this.userId },
            { $pull: { groups: groupId } },
            err => {
                if (!err) {
                    try {
                        GroupsDB.update(
                            { _id: groupId },
                            { $pull: { moderators: this.userId } }
                        );

                        GroupsDB.update(
                            { _id: groupId },
                            { $pull: { members: this.userId } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    profilesJoinDsbj(dsbjId) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }
        checkUserExist(this.userId);

        const dsbj = DsbjsDB.findOne({ _id: dsbjId });
        if (!dsbj)
            throw new Meteor.Error(
                "dsbj-does-not-exist",
                "The DSBJ event specified does not exists"
            );

        if (dsbj.createdBy === this.userId)
            throw new Meteor.Error(
                "already-in-dsbj",
                "You are the creator of that DSBJ"
            );

        const profile = ProfilesDB.findOne({ _id: this.userId });
        if (
            dsbj.attendees.includes(this.userId) &&
            profile.dsbjs.includes(dsbjId)
        ) {
            throw new Meteor.Error(
                "already-in-dsbj",
                "You are already in that DSBJ"
            );
        }

        const result = ProfilesDB.update(
            { _id: this.userId },
            { $addToSet: { dsbjs: dsbjId } },
            err => {
                if (!err) {
                    try {
                        DsbjsDB.update(
                            { _id: dsbjId },
                            { $addToSet: { attendees: this.userId } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    profilesLeaveDsbj(dsbjId) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }
        checkUserExist(this.userId);

        const dsbj = DsbjsDB.findOne({ _id: dsbjId });
        if (!dsbj)
            throw new Meteor.Error(
                "list-does-not-exist",
                "The list specified does not exist"
            );

        if (dsbj.createdBy === this.userId && dsbj.attendees.length !== 0) {
            throw new Meteor.Error(
                "owner-cannot-leave-non-empty-list",
                "Owner cannot leave if dsbj is not empty"
            );
        } else if (
            dsbj.createdBy === this.userId &&
            dsbj.attendees.length === 0
        ) {
            const result = ProfilesDB.update(
                { _id: this.userId },
                { $pull: { dsbjs: dsbjId } },
                err => {
                    if (!err) {
                        try {
                            DsbjsDB.remove({ _id: dsbjId });
                        } catch (newErr) {
                            throw newErr;
                        }
                    } else {
                        throw err;
                    }
                }
            );

            return result;
        }

        if (
            !dsbj.members.includes(this.userId) &&
            !dsbj.moderators.includes(this.userId)
        ) {
            throw new Meteor.Error("not-in-list", "You are not in that list");
        }

        const profile = ProfilesDB.findOne({ _id: this.userId });
        if (!profile.dsbjs.includes(dsbjId)) {
            throw new Meteor.Error("not-in-list", "You are not in that list");
        }

        const result = ProfilesDB.update(
            { _id: this.userId },
            { $pull: { dsbjs: dsbjId } },
            err => {
                if (!err) {
                    try {
                        DsbjsDB.update(
                            { _id: dsbjId },
                            { $pull: { attendees: this.userId } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    /**
     * Add a new tag to current user
     * @param {String} _id
     * @param {String} tag
     */
    profilesTagAdd(tag) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }

        checkUserExist(this.userId);
        return ProfilesDB.update(
            { _id: this.userId },
            { $addToSet: { tags: tag } }
        );
    },

    profilesTagRemove(tag) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }

        checkUserExist(this.userId);
        return ProfilesDB.update(
            { _id: this.userId },
            { $pull: { tags: tag } }
        );
    },

    /**
     * Update the profile of the current user
     * @param {String} newName
     * @param {String} newBio
     */
    profilesUpdate(newName, newBio) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }

        checkUserExist(this.userId);

        validateUserDisplayName(newName);
        validateUserBio(newBio);
        return ProfilesDB.update(
            { _id: this.userId },
            { $set: { bio: newBio, displayName: newName } }
        );
    },

    /**
     * Insert new profile, called only on new user creation
     * @param {String} _id
     * @param {String} displayName
     */
    profilesInsert(_id, displayName) {
        validateUserDisplayName(displayName);

        return ProfilesDB.insert({
            _id: _id,
            displayName: displayName,
            groups: [],
            dsbjs: [],
            tags: [],
            bio: "",
            createdAt: moment().valueOf()
        });
    }
});
