import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const ProfileDB = new Mongo.Collection("profiles");

if (Meteor.isServer) {
    Meteor.publish("profiles", function(_id) {
        return Meteor.users.find(
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
     * 
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
     * 
     * @param {String} _id 
     * @param {String} arg 
     */
    profilesUpdateBio(_id, arg) {
        return Meteor.users.update({_id}, {$set: {bio:arg}});
    }
});

export const validateNewUserClient = user => {
    const email = user.email;
    const password = user.password;
    const displayName = user.displayName;

    new SimpleSchema({
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        password: {
            type: String,
            min: 7,
            max: 50
        },
        displayName: {
            type: String,
            min: 2,
            max: 30
        }
    }).validate({ email, password, displayName });

    return true;
};

export const validateNewUserServer = user => {
    const email = user.emails[0].address;
    const displayName = user.displayName;

    new SimpleSchema({
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        displayName: {
            type: String,
            min: 1,
            max: 30
        }
    }).validate({ email, displayName });

    return true;
};

if (Meteor.isServer) {
    Accounts.validateNewUser(validateNewUserServer);

    Accounts.onCreateUser((options, user) => {
        if (options.displayName) {
            user.displayName = options.displayName;
        }

        user.groups = [];
        user.tags = [];
        user.bio = "";

        return user;
    });
}