import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

import { ProfilesDB } from "./profiles.js";

Meteor.methods({
    /**
     *
     * @param {String} _id
     * @param {String} arg
     */
    usersUpdateBio(_id, arg) {
        return Meteor.users.update({ _id }, { $set: { bio: arg } });
    }
});

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

    Meteor.call("profilesInsert", user._id, user.username, (err, res) => {
        if (err) {
            throw new Meteor.Error("profiles-insert-failed");
        }
    });

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
