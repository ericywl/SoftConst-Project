import SimpleSchema from "simpl-schema";

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
            min: 1,
            max: 50
        }
    }).validate({ email, password, displayName });

    return true;
};

export const validateNewUserServer = user => {
    const email = user.emails[0].address;
    const displayName = user.profile.displayName;

    new SimpleSchema({
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        displayName: {
            type: String,
            min: 1,
            max: 50
        }
    }).validate({ email, displayName });

    return true;
};

if (Meteor.isServer) {
    Meteor.publish("usersProfile", function() {
        return Meteor.users.find(
            {},
            {
                fields: {
                    profile: 1
                }
            }
        );
    });

    Accounts.validateNewUser(validateNewUserServer);

    Accounts.onCreateUser((options, user) => {
        if (options.profile) {
            user.profile = options.profile;
        }

        return user;
    });
}
