import { GroupsDB } from "../api/groups";
import { AdminsDB } from "../api/admins";
import { ProfilesDB } from "../api/profiles";

/**
 * Check if current user has moderator/admin access to the collection object
 * @param {*} _id: id of the object to be queried
 * @param {*} db: db to be searched
 */
export const checkAccess = (_id, db) => {
    if (!Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
    }

    const dbObj = db.findOne({ _id });
    if (!dbObj) {
        throw new Meteor.Error("object-not-found");
    }

    switch (db) {
        case GroupsDB:
            if (!dbObj.moderators.includes(Meteor.userId())) {
                if (!AdminsDB.findOne().admins.includes(Meteor.userId()))
                    throw new Meteor.Error("not-authorized");
            }
            break;

        case AdminsDB:
            if (!dbObj.admins.includes(Meteor.userId()))
                throw new Meteor.Error("not-authorized");
            break;

        default:
            throw new Meteor.Error("invalid-db");
            break;
    }

    return true;
};

export const checkUserExist = userId => {
    if (!Meteor.userId()) {
        throw new Meteor.Error("not-logged-in");
    }

    if (!Meteor.users.findOne({ _id: userId })) {
        throw new Meteor.Error("user-not-found");
    }

    if (!ProfilesDB.findOne({ _id: userId })) {
        throw new Meteor.Error("profile-not-found");
    }

    return true;
};

export const searchFilter = input => {
    return input.replace(/[^\w\s#]/gi, "");
};

export const tagFilter = input => {
    return input.replace(/[^\w\s]/gi, "");
};
