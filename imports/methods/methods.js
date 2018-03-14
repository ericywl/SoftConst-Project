import { GroupsDB } from "../api/groups";
import { AdminsDB } from "../api/admins";
import { ProfilesDB } from "../api/profiles";

export const checkAuth = (_id, db) => {
    if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
    }

    const dbObj = db.findOne({ _id });
    if (!dbObj) {
        throw new Meteor.Error("field-not-found");
    }

    const field = "moderators";
    if (db === GroupsDB && !dbObj[field].includes(Meteor.userId())) {
        if (!AdminsDB.findOne().admins.includes(Meteor.userId()))
            throw new Meteor.Error("access-denied");
    }

    return true;
};

export const checkUserExist = userId => {
    if (!Meteor.users.findOne({ _id: userId })) {
        throw new Meteor.Error("user-not-found");
    }

    if (!ProfilesDB.findOne({ _id: userId })) {
        throw new Meteor.Error("profile-not-found");
    }

    return true;
};

export const searchStrip = input => {
    return input.toLowerCase().replace(/[^\w\s#,]/gi, "");
};
