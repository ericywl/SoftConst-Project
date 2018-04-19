// Library
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

// API
import { ProfilesDB } from "./profiles";
import { DsbjsDB } from "./dsbjs";
import {
    checkUserExist,
    checkAccess,
    validateMessage,
    validateUserDisplayName
} from "../misc/methods";

export const DsbjsMessagesDB = new Mongo.Collection("dsbjsMessages");

if (Meteor.isServer) {
    Meteor.publish("messagesByDsbj", function(dsbjId) {
        if (!this.userId) {
            this.ready();
            throw new Meteor.Error("not-logged-in");
        }

        new SimpleSchema({
            dsbjId: { type: String }
        }).validate({ dsbjId });

        return DsbjsMessagesDB.find({ dsbjId }, { sort: { sentAt: 1 } });
    });
}

Meteor.methods({
    dsbjsMessagesInsert(partialMsg) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(this.userId);

        const userDisplayName = ProfilesDB.findOne({ _id: this.userId })
            .displayName;

        validateUserDisplayName(userDisplayName);
        validateMessage("dsbjs", partialMsg);

        const now = moment().valueOf();
        const result = DsbjsMessagesDB.insert(
            {
                dsbjId: partialMsg.dsbjId,
                content: partialMsg.content,
                userId: this.userId,
                userDisplayName,
                sentAt: now
            },
            err => {
                if (!err) {
                    try {
                        DsbjsDB.update(
                            {
                                _id: partialMsg.dsbjId
                            },
                            { $set: { lastMessageAt: now } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    dsbjsMessagesWelcome(dsbjId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");
        checkUserExist(this.userId);

        const userDisplayName = ProfilesDB.findOne({ _id: this.userId })
            .displayName;

        validateUserDisplayName(userDisplayName);

        const now = moment().valueOf();
        const result = DsbjsMessagesDB.insert(
            {
                dsbjId: dsbjId,
                content: `${userDisplayName} has joined the event!`,
                userId: this.userId,
                userDisplayName: "",
                sentAt: now
            },
            err => {
                if (!err) {
                    try {
                        DsbjsDB.update(
                            { _id: groupId },
                            { $set: { lastMessageAt: now } }
                        );
                    } catch (newErr) {
                        throw newErr;
                    }
                } else {
                    throw err;
                }
            }
        );

        return result;
    },

    dsbjsMessagesRemove(messageId) {
        if (!this.userId) throw new Meteor.Error("not-logged-in");

        const message = DsbjsMessagesDB.findOne({ _id: messageId });
        if (!message) throw new Meteor.Error("message-does-not-exist");

        if (message.userId !== this.userId) {
            checkAccess(message.dsbjId, DsbjsDB);
        }

        return DsbjsMessagesDB.remove({ _id: messageId });
    }
});
