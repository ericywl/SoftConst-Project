import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const ProfileDB = new Mongo.Collection("profiles");

if (Meteor.isServer) {
    Meteor.publish("profiles", function(_id) {
        return ProfileDB.find(
            {_id},
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
     * Method to insert new profile, called only on new user creation
     * @param {String} _id 
     * @param {String} displayName 
     */
    profilesInsert(_id, displayName) {
        return ProfileDB.insert({
            _id: _id,
            displayName: displayName,
            groups: [],
            tags: [],
            bio: ""
        });
    },
    /**
     * Method to add tag to current set of user specified by _id
     * @param {String} _id 
     * @param {String} tag 
     */
    profilesAddTag(_id, tag) {
        var doc = ProfileDB.findOne({_id:_id});
        if (!doc) {
            console.log(_id + " does not exist");
        } else {
            return ProfileDB.update({_id:_id}, {$addToSet: {tags:tag}});
        }
    },
    profilesRemoveTag(_id, tag) {

    },
    /**
     * Method to update the bio of user specified by _id
     * @param {String} _id 
     * @param {String} arg 
     */
    profilesUpdateBio(_id, arg) {
        return ProfileDB.update({_id}, {$set: {bio:arg}});
    }
});