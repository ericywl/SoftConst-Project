import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import {
    checkAccess,
    checkUserExist,
    tagFilter,
    checkUserExist
} from "../methods/methods";

export const DsbjsDB = new Mongo.Collection("dsbjs");

if (Meteor.isServer) {
    Meteor.publish("dsbjs", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        return DsbjsDB.find();
    });
}

Meteor.methods({
    /**
     * Insert a new DSBJ event into database
     * @param {Object} partialDsbj
     */
    dsbjsInsert(partialDsbj) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        validateNewDsbj(partialDsbj);

        return DsbjsDB.insert({
            name: partialDsbj.name,
            description: partialDsbj.description,
            isPrivate: partialDsbj.isPrivate,
            tags: [],
            lastMessageAt: moment().valueOf(),
            timeout: partialDsbj.timeout,
            createdAt: moment().valueOf(),
            createdBy: this.userId,
            numberReq: partialDsbj.numberReq,
            attendees: []
        });
    },

    /**
     * Remove DSBJ event from database
     * @param {String} _id : id of the group to be removed
     */
    dsbjsRemove(_id) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        checkAccess(_id, DsbjsDB);

        return DsbjsDB.remove({ _id });
    },

    dsbjsAddAttendee() {},

    dsbjsRemoveAttendee() {},

    /**
     * Add tag to a DSBJ event
     * @param {String} _id : id of the group
     * @param {String} tag : tag to be inserted
     */
    dsbjsAddTag(_id, tag) {
        checkAccess(_id, DsbjsDB);
        const formattedTag = tagFilter(tag);

        return DsbjsDB.update({ _id }, { $addToSet: { tags: formattedTag } });
    },

    /**
     * Remove tag from the DSBJ identified by id if exists
     * @param {String} _id : id of the group
     * @param {String} tag : tag to be removed
     */
    dsbjsRemoveTag(_id, tag) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        checkAccess(_id, DsbjsDB);
        const formattedTag = tagFilter(tag);

        if (!DsbjsDB.findOne({ _id, tags: formattedTag }))
            throw new Meteor.Error("tag-not-found");

        return DsbjsDB.update({ _id }, { $pull: { tags: formattedTag } });
    },

    dsbjsUpdateTimeout(_id, newTimeout) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        checkAccess(_id, DsbjsDB);
    },

    /**
     * Update last message at, called only when messages are inserted
     * @param {String} _id : id of the group
     * @param {Number} time : time of last message
     */
    dsbjsUpdateLastMessageAt(_id, time) {
        return DsbjsDB.update({ _id }, { $set: { lastMessageAt: time } });
    }
});

const validateNewDsbj = partialDsbj => {
    new SimpleSchema({
        name: {
            type: String,
            min: 3,
            max: 30
        },
        description: {
            type: String,
            max: 50
        },
        isPrivate: {
            type: Boolean
        },
        timeout: {
            type: SimpleSchema.Integer,
            min: moment().valueOf()
        },
        numberReq: {
            type: SimpleSchema.Integer,
            min: 1
        }
    }).validate({
        name: partialDsbj.name,
        description: partialDsbj.description,
        isPrivate: partialDsbj.isPrivate
    });

    return true;
};
