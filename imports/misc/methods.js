// Library
import SimpleSchema from "simpl-schema";

// API
import { GroupsDB } from "../api/groups";
import { AdminsDB } from "../api/admins";
import { ProfilesDB } from "../api/profiles";
import { DsbjsDB } from "../api/dsbjs";

/**
 * Check if current user has owner/moderator/admin access to the collection object
 * @param {String} itemId : id of the object to be queried
 * @param {String} userId : id of currentUser
 * @param {Mongo.Collection} db : db to be searched
 */
export const checkAccess = (itemId, db) => {
    if (!Meteor.isTest) {
        const dbObj = db.findOne({ _id: itemId });
        if (!dbObj) throw new Meteor.Error("object-not-found");

        let accessLevel = "low";
        if (AdminsDB.findOne().h4x0rs.includes(Meteor.userId())) {
            return accessLevel;
        }

        switch (db) {
            case GroupsDB:
                if (dbObj.ownedBy === Meteor.userId()) {
                    accessLevel = "high";
                } else if (!dbObj.moderators.includes(Meteor.userId())) {
                    throw new Meteor.Error("not-authorized");
                }

                break;

            case DsbjsDB:
                if (dbObj.createdBy === Meteor.userId()) {
                    accessLevel = "high";
                } else {
                    throw new Meteor.Error("not-authorized");
                }

                break;

            default:
                throw new Meteor.Error("invalid-db");
                break;
        }

        return accessLevel;
    }
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
 * @param {String} input : tag input
 */
export const tagFilter = input => {
    return input.replace(/[^\w\s]/gi, "");
};

export const spaceFilter = input => {
    return input.replace(/\s+/gi, " ");
};

/**
 * Filter number input
 * @param {String} input : number string input
 */
export const numberFilter = input => {
    return input.replace(/[^\d]/gi, "");
};

/**
 * Filter the items array using the query
 * @param {Array} items : the items to be queried against
 * @param {String} query : the query string
 */
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

/**
 * Capitalize the first letter of the string
 * @param {String} str : string to be formatted
 */
export const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// SIMPLE SCHEMA VALIDATION
import {
    ROOM_TEXT_ARR,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    ITEMNAME_MIN_LENGTH,
    ITEMNAME_MAX_LENGTH,
    GROUPDESC_MAX_LENGTH,
    DSBJ_MAX_TIMEOUT,
    DSBJ_MAX_NUMREQ
} from "../misc/constants";

/* GROUPS */
export const validateGroup = partialGroup => {
    new SimpleSchema({
        name: {
            type: String,
            min: ITEMNAME_MIN_LENGTH,
            max: ITEMNAME_MAX_LENGTH
        },
        description: {
            type: String,
            max: GROUPDESC_MAX_LENGTH
        }
    }).validate({
        name: partialGroup.name,
        description: partialGroup.description
    });

    return true;
};

export const validateGroupName = groupName => {
    new SimpleSchema({
        name: {
            type: String,
            min: ITEMNAME_MIN_LENGTH,
            max: ITEMNAME_MAX_LENGTH
        }
    }).validate({
        name: groupName
    });

    return true;
};

export const validateGroupId = groupId => {
    new SimpleSchema({
        groupId: {
            type: String,
            min: 1,
            max: 20
        }
    }).validate({
        groupId
    });

    return true;
};

/* DSBJS */
export const validateDsbj = partialDsbj => {
    new SimpleSchema({
        name: {
            type: String,
            min: ITEMNAME_MIN_LENGTH,
            max: ITEMNAME_MAX_LENGTH
        },
        description: {
            type: String,
            max: DSBJDESC_MAX_LENGTH
        },
        timeout: {
            type: SimpleSchema.Integer,
            min: 1,
            max: DSBJ_MAX_TIMEOUT
        },
        numberReq: {
            type: SimpleSchema.Integer,
            min: 0,
            max: DSBJ_MAX_NUMREQ
        }
    }).validate({
        name: partialDsbj.name,
        description: partialDsbj.description,
        timeout: partialDsbj.timeout,
        numberReq: partialDsbj.numberReq
    });

    return true;
};

/* MESSAGES */
export const validateMessage = partialMsg => {
    new SimpleSchema({
        groupId: { type: String },
        room: {
            type: String,
            custom() {
                if (!ROOM_TEXT_ARR.includes(this.value)) {
                    return "invalidRoom";
                }
            }
        },
        content: { type: String }
    }).validate({
        groupId: partialMsg.groupId,
        room: partialMsg.room,
        content: partialMsg.content
    });

    return true;
};

/* PROFILES */
export const validateUserDisplayName = userDisplayName => {
    new SimpleSchema({
        userDisplayName: {
            type: String,
            min: USERNAME_MIN_LENGTH,
            max: USERNAME_MAX_LENGTH
        }
    }).validate({
        userDisplayName
    });

    return true;
};