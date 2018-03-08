import { SimpleSchema } from "simpl-schema/dist/SimpleSchema";

export function validateUser(email, password) {
    try {
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
    } catch (e) {
        return e.reason;
    }
}
