import { GroupsDB } from "../api/groups";
import { AdminsDB } from "../api/admins";
import { ProfilesDB } from "../api/profiles";

/**
 * Check if current user has moderator/admin access to the collection object
 * @param {String} _id : id of the object to be queried
 * @param {Mongo.Collection} db : db to be searched
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

/**
 * Check if user exists in both ProfilesDB and Meteor.users
 * @param {String} userId : user id to be checked
 */
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

/**
 * Filter search input before storing in session variable
 * @param {String} input : search bar input
 */
export const searchFilterBeforeSet = input => {
    return input.replace(/[^\w\s#]/gi, "");
};

/**
 * Filter search query string before fetching from database
 * @param {String} input : search bar input
 */
export const searchFilterBeforeFetch = input => {
    return input.replace(/[^\w#]/gi, "").toLowerCase();
};

export const tagFilter = input => {
    return input.replace(/[^\w\s]/gi, "");
};
