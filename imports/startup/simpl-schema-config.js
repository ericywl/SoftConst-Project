import { SimpleSchema } from "simpl-schema/dist/SimpleSchema";

SimpleSchema.defineValidationErrorTransform(error => {
    return new Meteor.Error(400, error.message);
});