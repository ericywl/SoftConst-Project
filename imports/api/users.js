// Library
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

// API
import { ProfilesDB } from "./profiles.js";
import { USERNAME_MIN_LENGTH } from "../misc/constants";

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
            min: USERNAME_MIN_LENGTH,
            max: 30
        }
    }).validate({ email, password, username });

    return true;
};

export const validateNewUserServer = user => {
    const email = user.emails[0].address;
    const username = user.username;

    new SimpleSchema({
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        username: {
            type: String,
            min: USERNAME_MIN_LENGTH,
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

        user.username = options.username;
        return user;
    });
}
