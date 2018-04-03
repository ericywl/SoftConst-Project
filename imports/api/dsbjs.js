import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";
import { ProfilesDB } from "./profiles";

import {
    checkAccess,
    checkUserExist,
    tagFilter,
    validateDsbj,
    validateDsbjName
} from "../misc/methods";

export const DsbjsDB = new Mongo.Collection("dsbjs");

if (Meteor.isServer) {
    Meteor.publish("dsbjs", function() {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        return DsbjsDB.find({}, { $limit: 100 });
    });
}

Meteor.methods({
    /**
     * Insert a new DSBJ event into database
     * @param {Object} partialDsbj
     */
    dsbjsInsert(partialDsbj) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateDsbj(partialDsbj);

        const now = moment().valueOf();
        const timeoutAt = now + partialDsbj.timeout;

        try {
            const res = DsbjsDB.insert({
                name: partialDsbj.name,
                description: partialDsbj.description,
                numberReq: partialDsbj.numberReq,
                timeoutAt: timeoutAt,
                lastMessageAt: now,
                createdAt: now,
                createdBy: this.userId,
                tags: [],
                attendees: []
            });

            ProfilesDB.update({ _id: this.userId }, { $push: { dsbjs: res } });

            return res;
        } catch (err) {
            throw err;
        }
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
     * Add tag to a DSBJ event
     * @param {String} dsbjId : id of the list
     * @param {String} addedTag : tag to be inserted
     */
    dsbjsTagAdd(dsbjId, addedTag) {
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
     * @param {String} dsbjId : id of the list
     * @param {String} removedTag : tag to be removed
     */
    dsbjsTagRemove(dsbjId, removedTag) {
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
     * Change the list name
     * @param {String} dsbjId : id of the list
     * @param {String} newName : the list's new name
     */
    dsbjsNameChange(dsbjId, newName) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateDsbjName(newName);
        checkAccess(dsbjId, DsbjsDB);

        return DsbjsDB.update({ _id: dsbjId }, { $set: { name: newName } });
    },

    /**
     * Update the timeout, ie. shorten or extend DSBJ response deadline
     * @param {String} dsbjId : id of DSBJ to be updated
     * @param {String} newTimeout : the new timeout
     */
    dsbjsTimeoutUpdate(dsbjId, newTimeout) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

        const dsbj = DsbjsDB.findOne({ _id: dsbjId });
        const dsbjCreatedAt = dsbj.createdAt;
        const newTimeoutAt = dsbjCreatedAt + newTimeout;
        if (newTimeoutAt <= moment().valueOf())
            throw new Meteor.Error("timeout-in-past");

        return DsbjsDB.update(
            { _id: dsbjId },
            { set: { timeoutAt: newTimeoutAt } }
        );
    },

    /**
     * Update the required number of people for the DSBJ event
     * @param {String} dsbjId : id of DSBJ to be updated
     * @param {String} newNumberReq : the new number of attendees required
     */
    dsbjsNumberReqUpdate(dsbjId, newNumberReq) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

        const dsbj = DsbjsDB.findOne({ _id: dsbjId });
        const numOfAttendees = dsbj.attendees.length;
        if (numOfAttendees > newNumberReq)
            throw new Meteor.Error("more-attendees-than-numreq");

        return DsbjsDB.update(
            { _id: dsbjId },
            { set: { numberReq: newNumberReq } }
        );
    },

    /* DEPRECATED */
    /**
     * Add a new attendee to a DSBJ event
     * @param {String} dsbjId : id of the DSBJ event
     * @param {String} addedUserId : user id to be added
     */
    dsbjsAttendeeAdd(dsbjId, addedUserId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

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
    dsbjsAttendeeRemove(dsbjId, removedUserId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkAccess(dsbjId, DsbjsDB);

        if (!DsbjsDB.findOne({ dsbjId }).attendees.includes(removedUserId))
            throw new Meteor.Error("user-not-in-dsbj");

        return DsbjsDB.update(
            { _id: dsbjId },
            { $pull: { attendees: removedUserId } }
        );
    }
});
