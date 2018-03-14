// Library
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { Session } from "meteor/session";
import { Redirect } from "react-router-dom";

// APIs
import history from "../startup/history";
import { getRoutes } from "../routes/routes";
import "../startup/simpl-schema-config";

if (Meteor.isClient) {
    Meteor.startup(() => {
        Meteor.call("adminsInsert");
        Session.setDefault("selectedGroupId", "");
        Session.setDefault("searchQuery", "");
        Session.setDefault("isNavOpen", false);
        Session.setDefault("sessionTime", moment().valueOf());

        Tracker.autorun(() => {
            const isAuthenticated = !!Meteor.userId();
            const routes = getRoutes(isAuthenticated);

            ReactDOM.render(routes, document.getElementById("render-target"));
        });
    });
}

Meteor.setInterval(updateSessionTime, 20000);

/**
 * Update the session time to refresh fromNow value in group list
 */
function updateSessionTime() {
    Session.set("sessionTime", moment().valueOf());
}
