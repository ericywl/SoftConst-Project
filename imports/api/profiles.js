import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const ProfilesDB = new Mongo.Collection("profiles");

if (Meteor.isServer) {
    Meteor.publish("profiles", function(_id) {
        return ProfilesDB.find(
            { _id },
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
            bio: ""
        });
    },

    /**
     * Add a new tag to current user
     * @param {String} _id
     * @param {String} tag
     */
    profilesAddTag(tag) {
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        const userProfile = ProfilesDB.findOne({ _id: this.userId });
        if (!userProfile || userProfile.length === 0) {
            throw new Meteor.Error("profile-not-found");
        }

        return ProfilesDB.update(
            { _id: this.userId },
            { $addToSet: { tags: tag } }
        );
    },

    profilesRemoveTag(_id, tag) {},

    /**
     * Update the bio of the current user
     * @param {String} _id
     * @param {String} newBio
     */
    profilesUpdateBio(newBio) {
        return ProfilesDB.update(
            { _id: this.userId },
            { $set: { bio: newBio } }
        );
    }
});
