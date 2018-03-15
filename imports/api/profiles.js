import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { GroupsDB } from "./groups";
import { checkUserExist } from "../methods/methods";

export const ProfilesDB = new Mongo.Collection("profiles");
export const CurrProfileDB = new Mongo.Collection("currentProfile");
export const GroupProfilesDB = new Mongo.Collection("groupProfiles");

if (Meteor.isServer) {
    Meteor.publish("profiles", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        return ProfilesDB.find(
            {},
            {
                fields: {
                    displayName: 1,
                    groups: 1,
                    tags: 1,
                    bio: 1
                }
            }
        );
    });

    Meteor.publish("currentProfile", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        Mongo.Collection._publishCursor(
            ProfilesDB.find(
                { _id: this.userId },
                {
                    fields: {
                        displayName: 1,
                        groups: 1,
                        tags: 1,
                        bio: 1
                    }
                }
            ),
            this,
            "currentProfile"
        );
        this.ready();
    });

    Meteor.publish("groupProfiles", function(groupId) {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        if (!groupId) {
            this.ready();
            return [];
        }

        const group = GroupsDB.findOne({ _id: groupId });
        const groupUsers = group.members.concat(group.moderators);

        Mongo.Collection._publishCursor(
            ProfilesDB.find(
                { _id: { $in: groupUsers } },
                {
                    fields: {
                        displayName: 1,
                        groups: 1,
                        tags: 1,
                        bio: 1
                    }
                }
            ),
            this,
            "groupProfiles"
        );
        this.ready();
    });
}

Meteor.methods({
    profilesJoinGroup(groupId) {
        const _id = Meteor.userId();
        if (Meteor.isServer) {
            checkUserExist(_id);
            if (ProfilesDB.findOne({ _id }).groups.includes(groupId)) {
                throw new Meteor.Error("already-in-group");
            }
        }

        return ProfilesDB.update({ _id }, { $push: { groups: groupId } });
    },

    /**
     * Add a new tag to current user
     * @param {String} _id
     * @param {String} tag
     */
    profilesAddTag(tag) {
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
        }

        return ProfilesDB.update(
            { _id: Meteor.userId() },
            { $addToSet: { tags: tag } }
        );
    },

    profilesRemoveTag(_id, tag) {
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
        }
    },

    profilesUpdateDisplayName() {
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
        }
    },

    /**
     * Update the bio of the current user
     * @param {String} _id
     * @param {String} newBio
     */
    profilesUpdateBio(newBio) {
        if (Meteor.isServer) {
            checkUserExist(Meteor.userId());
        }

        return ProfilesDB.update(
            { _id: Meteor.userId() },
            { $set: { bio: newBio } }
        );
    },

    /**
     * Insert new profile, called only on new user creation
     * @param {String} _id
     * @param {String} displayName
     */
    profilesInsert(_id, displayName) {
        return ProfilesDB.insert({
            _id,
            displayName: displayName,
            groups: [],
            tags: [],
            bio: "",
            createdAt: moment().valueOf()
        });
    }
});
