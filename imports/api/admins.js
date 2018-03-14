import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { checkAccess, checkUserExist } from "../methods/methods";

export const AdminsDB = new Mongo.Collection("admins");

studChatAdmins = "0ovflfbp5Br8spA086VhdsCEo6quGhmCOq26H";

if (Meteor.isServer) {
    Meteor.publish("admins", function() {
        return AdminsDB.find(
            { _id: studChatAdmins },
            { fields: { admins: 1 } }
        );
    });
}

Meteor.methods({
    /**
     * Called on initialization
     */
    adminsInsert() {
        if (AdminsDB.findOne()) return 0;

        return AdminsDB.insert({
            _id: studChatAdmins,
            admins: []
        });
    },

    /**
     * Add user to the list of admins
     * @param {String} userId: id of user to be added
     */
    adminsAddUserId(userId) {
        checkUserExist(Meteor.userId());
        checkUserExist(userId);
        checkAccess(studChatAdmins, AdminsDB);

        return AdminsDB.update(
            { _id: studChatAdmins },
            { $push: { admins: userId } }
        );
    }
});
