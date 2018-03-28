// Library
import SimpleSchema from "simpl-schema";

// API
import { GroupsDB } from "../api/groups";
import { AdminsDB } from "../api/admins";
import { ProfilesDB } from "../api/profiles";
import { DsbjsDB } from "../api/dsbjs";

/**
 * Check if current user has moderator/admin access to the collection object
 * @param {String} itemId : id of the object to be queried
 * @param {String} userId : id of currentUser
 * @param {Mongo.Collection} db : db to be searched
 */
export const checkAccess = (itemId, db) => {
    if (!Meteor.isTest) {
        const dbObj = db.findOne({ _id: itemId });
        if (!dbObj) throw new Meteor.Error("object-not-found");
        if (AdminsDB.findOne().h4x0rs.includes(Meteor.userId())) return true;

        switch (db) {
            case GroupsDB:
                if (!dbObj.moderators.includes(Meteor.userId()))
                    throw new Meteor.Error("not-authorized");
                break;

            case DsbjsDB:
                if (dbObj.createdBy !== Meteor.userId())
                    throw new Meteor.Error("not-authorized");
                break;

            default:
                throw new Meteor.Error("invalid-db");
                break;
        }
    }

    return true;
};

/**
 * Check if user exists in Meteor.users and ProfilesDB
 * @param {String} userId : user id to be checked
 */
export const checkUserExist = userId => {
    new SimpleSchema({
        userId: String
    }).validate({ userId });

    if (!Meteor.isTest) {
        if (!Meteor.users.findOne({ _id: userId }))
            throw new Meteor.Error("user-not-found");

        if (!ProfilesDB.findOne({ _id: userId }))
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

/**
 * Filter the tag input in ManageGroupTags
 * @param {String} input
 */
export const tagFilter = input => {
    return input.replace(/[^\w\s]/gi, "");
};

export const filterItemsByQuery = (items, query) => {
    if (!items) throw new Meteor.Error("filter-groups-not-provided");
    if (!query) return items;

    query = searchFilterBeforeFetch(query);
    if (query[0] === "#") {
        query = query.slice(1);
        const queryLen = query.length;
        return items.filter(item => {
            for (let i = 0; i < item.tags.length; i++) {
                const tag = item.tags[i].slice(0, queryLen);
                if (tag.toLowerCase() === query) return true;
            }

            return false;
        });
    }

    return items.filter(
        item => searchFilterBeforeFetch(item.name).indexOf(query) !== -1
    );
};

export const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// SIMPLE SCHEMA
/* GROUPS */
export const validateGroupName = groupName => {
    new SimpleSchema({
        name: {
            type: String,
            min: 5,
            max: 40
        }
    }).validate({
        name: groupName
    });

    return true;
};

export const validateGroup = partialGroup => {
    new SimpleSchema({
        name: {
            type: String,
            min: 5,
            max: 30
        },
        description: {
            type: String,
            max: 50
        },
        isPrivate: { type: Boolean }
    }).validate({
        name: partialGroup.name,
        description: partialGroup.description,
        isPrivate: partialGroup.isPrivate
    });

    return true;
};

/* MESSAGES */
export const validateMessage = partialMsg => {
    new SimpleSchema({
        groupId: { type: String },
        content: { type: String }
    }).validate({
        groupId: partialMsg.groupId,
        content: partialMsg.content
    });

    return true;
};

/* PROFILES */
export const validateUserDisplayName = userDisplayName => {
    new SimpleSchema({
        userDisplayName: {
            type: String,
            min: 5,
            max: 30
        }
    }).validate({
        userDisplayName
    });

    return true;
};
