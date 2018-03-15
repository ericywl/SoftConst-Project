import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { checkAccess, checkUserExist, tagFilter } from "../methods/methods";

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
     * @param {String} dsbjId : id of the event to be removed
     */
    dsbjsRemove(dsbjId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

        return DsbjsDB.remove({ _id: dsbjId });
    },

    /**
     * Add a new attendee to a DSBJ event
     * @param {String} dsbjId : id of the DSBJ event
     * @param {String} addedUserId : user id to be added
     */
    dsbjsAddAttendee(dsbjId, addedUserId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, addedUserId);

        if (DsbjsDB.findOne({ dsbjId }).attendees.includes(removedUserId))
            throw new Meteor.Error("user-already-in-dsbj");

        return DsbjsDB.update(
            { _id: dsbjId },
            { $addToSet: { attendees: addedUserId } }
        );
    },

    /**
     * Remove specified userId from DSBJ event
     * @param {String} dsbjId : id of the DSBJ event
     * @param {String} removedUserId : user id to be removed
     */
    dsbjsRemoveAttendee(dsbjId, removedUserId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, removedUserId);

        if (!DsbjsDB.findOne({ dsbjId }).attendees.includes(removedUserId))
            throw new Meteor.Error("user-not-in-dsbj");

        return DsbjsDB.update(
            { _id: dsbjId },
            { $pull: { attendees: removedUserId } }
        );
    },

    /**
     * Add tag to a DSBJ event
     * @param {String} dsbjId : id of the group
     * @param {String} addedTag : tag to be inserted
     */
    dsbjsAddTag(dsbjId, addedTag) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);
        const formattedTag = tagFilter(addedTag);

        if (DsbjsDB.findOne({ dsbjId, tags: formattedTag }))
            throw new Meteor.Error("tag-already-in-dsbj");

        return DsbjsDB.update(
            { _id: dsbjId },
            { $addToSet: { tags: formattedTag } }
        );
    },

    /**
     * Remove tag from the DSBJ event identified by id if exists
     * @param {String} dsbjId : id of the group
     * @param {String} removedTag : tag to be removed
     */
    dsbjsRemoveTag(dsbjId, removedTag) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);
        const formattedTag = tagFilter(removedTag);

        if (!DsbjsDB.findOne({ dsbjId, tags: formattedTag }))
            throw new Meteor.Error("tag-not-in-dsbj");

        return DsbjsDB.update(
            { _id: dsbjId },
            { $pull: { tags: formattedTag } }
        );
    },

    /**
     * Update the timeout, ie. shorten or extend DSBJ response deadline
     * @param {String} dsbjId : id of DSBJ to be updated
     * @param {String} newTimeout : the new timeout
     */
    dsbjsUpdateTimeout(dsbjId, newTimeout) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

        return DsbjsDB.update(
            { _id: dsbjId },
            { set: { timeout: newTimeout } }
        );
    },

    /**
     *
     * @param {String} dsbjId : id of DSBJ to be updated
     * @param {String} newNumberReq : the new number of attendees required
     */
    dsbjsUpdateNumberReq(dsbjId, newNumberReq) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

        return DsbjsDB.update(
            { _id: dsbjId },
            { set: { numberReq: newNumberReq } }
        );
    },

    /**
     * Update last message at, called only when messages are inserted
     * @param {String} dsbjId : id of the group
     * @param {Number} time : time of last message
     */
    dsbjsUpdateLastMessageAt(dsbjId, time) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        return DsbjsDB.update(
            { _id: dsbjId },
            { $set: { lastMessageAt: time } }
        );
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
