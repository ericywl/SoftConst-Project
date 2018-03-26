import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { ProfilesDB } from "./profiles.js";

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

export const validateNewUserClient = user => {
    const email = user.email;
    const password = user.password;
    const username = user.username;

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
        username: {
            type: String,
            min: 2,
            max: 30
        }
    }).validate({ email, password, username });

    return true;
};

export const validateNewUserServer = user => {
    const email = user.emails[0].address;
    const username = user.username;

    console.log(email, username);

    new SimpleSchema({
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        username: {
            type: String,
            min: 2,
            max: 30
        }
    }).validate({ email, username });

    if (!Meteor.isTest) {
        Meteor.call("profilesInsert", user._id, user.username);
    }

    return true;
};

if (Meteor.isServer) {
    Accounts.validateNewUser(validateNewUserServer);

    Accounts.onCreateUser((options, user) => {
        if (!options.username) {
            throw new Meteor.Error("username-not-provided");
        }
        /*ProfilesDB.insert({
            _id: user._id,
            displayName: user.displayName,
            groups: [],
            tags: [],
            bio: ""
        })*/
    
        return user;
    });
}

    
