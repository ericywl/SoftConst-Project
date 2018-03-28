import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { checkUserExist } from "../misc/misc";

export const ProfilesDB = new Mongo.Collection("profiles");

if (Meteor.isServer) {
    Meteor.publish("profiles", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        return ProfilesDB.find(
            { _id: this.userId },
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
}

Meteor.methods({
    profilesJoinGroup(groupId) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }

        checkUserExist(this.userId);
        return ProfilesDB.update(
            { _id: this.userId },
            { $push: { groups: groupId } }
        );
    },

    /**
     * Add a new tag to current user
     * @param {String} _id
     * @param {String} tag
     */
    profilesAddTag(tag) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }

        checkUserExist(this.userId);
        return ProfilesDB.update(
            { _id: this.userId },
            { $addToSet: { tags: tag } }
        );
    },

    profilesRemoveTag(_id, tag) {},

    profilesUpdateDisplayName() {},

    /**
     * Update the bio of the current user
     * @param {String} _id
     * @param {String} newBio
     */
    profilesUpdateBio(newBio) {
        if (!this.userId) {
            throw new Meteor.Error("not-logged-in");
        }

        checkUserExist(this.userId);
        return ProfilesDB.update(
            { _id: this.userId },
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
            _id: _id,
            displayName: displayName,
            groups: [],
            tags: [],
            bio: "",
            createdAt: moment().valueOf()
        });
    }
});
