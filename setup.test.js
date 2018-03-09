import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SimpleSchema from "simpl-schema";

configure({ adapter: new Adapter() });

SimpleSchema.defineValidationErrorTransform(error => {
    return new Meteor.Error(400, error.message);
});
