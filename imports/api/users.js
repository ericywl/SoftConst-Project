import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { ProfileDB } from "./profile.js";

//export const UsersDB = new Mongo.Collection("usersProfile");

if (Meteor.isServer) {
    Meteor.publish("userProfile", function(_id) {
        return Meteor.users.find(
            {_id},
            {
                fields: {
                    /*displayName: 1,
                    groups: 1,
                    tags: 1,
                    bio: 1*/
                }
            }
        );
    });
}

Meteor.methods({
    /*usersJoinGroup(groupId) {
        Meteor.users;
    },*/
    /**
     * 
     * @param {String} _id 
     * @param {String} arg 
     */
    usersUpdateBio(_id, arg) {
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
    //Meteor.subscribe("profiles", "");
    Accounts.validateNewUser(validateNewUserServer);

    Accounts.onCreateUser((options, user) => {
        if (options.displayName) {
            user.displayName = options.displayName;
        }
        //Meteor.call("profilesInsert", Meteor.userId(), user.displayName)
        /*
        user.groups = [];
        user.tags = [];
        user.bio = "";
        */
        return user;
    });
}

    
