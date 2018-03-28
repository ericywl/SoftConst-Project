import SimpleSchema from "simpl-schema";

SimpleSchema.defineValidationErrorTransform(error => {
    return new Meteor.Error(400, error.message);
});

SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            invalidRoom: "The room provided is invalid"
        }
    }
});
