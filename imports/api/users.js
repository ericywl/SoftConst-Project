import SimpleSchema from "simpl-schema";

export const validateNewUser = (email, password) => {
    new SimpleSchema({
        email: {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        password: {
            type: String,
            min: 7,
            max: 50
        }
    }).validate({ email, password });

    return true;
};
