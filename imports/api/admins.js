import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { checkAccess, checkUserExist } from "../methods/methods";

export const AdminsDB = new Mongo.Collection("pwn3d");

studChatAdmins = "0ovflfbp5Br8spA086VhdsCEo6quGhmCOq26H";

if (Meteor.isServer) {
    Meteor.publish("pwn3d", function() {
        return AdminsDB.find(
            { _id: studChatAdmins },
            { fields: { h4x0rs: 1 } }
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
            h4x0rs: []
        });
    },

    /**
     * Add user to the list of admins
     * @param {String} userId: id of user to be added
     */
    adminsAddUserId(userId) {
        checkAccess(studChatAdmins, AdminsDB);
        checkUserExist(userId);

        if (AdminsDB.findOne())
            return AdminsDB.update(
                { _id: studChatAdmins },
                { $addToSet: { h4x0rs: userId } }
            );
    }
});
