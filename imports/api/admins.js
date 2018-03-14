import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

import { checkAuth, checkUserExist } from "../methods/methods";

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

    adminsAddUserId(userId) {
        checkAuth(studChatAdmins, AdminsDB);
        checkUserExist(userId);

        return AdminsDB.update(
            { _id: studChatAdmins },
            { $push: { admins: userId } }
        );
    }
});
