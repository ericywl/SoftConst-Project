import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { ProfilesDB } from "./profiles";
import {
    checkAccess,
    checkUserExist,
    tagFilter,
    validateDsbj
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
        const timeoutAt = moment(now)
            .add(partialDsbj.timeout, "hours")
            .valueOf();

        console.log(timeoutAt);

        try {
            const res = DsbjsDB.insert({
                name: partialDsbj.name,
                description: partialDsbj.description,
                numberReq: partialDsbj.numberReq,
                timeoutHours: partialDsbj.timeout,
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
     * Change the dsbj name and description
     * @param {String} dsbjId : id of the dsbj
     * @param {Object} partialNewDsbj: new dsbj object
     */
    dsbjsDetailsChange(dsbjId, partialNewDsbj) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        validateDsbj(partialNewDsbj);
        checkAccess(dsbjId, DsbjsDB);

        const dsbj = DsbjsDB.findOne({ _id: dsbjId });
        const newTimeoutAt = moment(dsbj.createdAt)
            .hours(partialNewDsbj.timeout)
            .valueOf();
        if (newTimeoutAt <= moment().valueOf())
            throw new Meteor.Error("timeout-in-past");

        const numOfAttendees = dsbj.attendees.length;
        if (numOfAttendees > partialNewDsbj.numberReq)
            throw new Meteor.Error("more-attendees-than-numreq");

        return DsbjsDB.update(
            { _id: dsbjId },
            {
                $set: {
                    name: partialNewDsbj.name,
                    description: partialNewDsbj.description,
                    numberReq: partialNewDsbj.numberReq,
                    timeoutHours: partialNewDsbj.timeout,
                    timeoutAt: newTimeoutAt
                }
            }
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
