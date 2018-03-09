import React from "react";
import ReactDOM from "react-dom";
import { Session } from "meteor/session";

import { getRoutes } from "../imports/routes/routes";
import "../imports/startup/simpl-schema-config";

Meteor.startup(() => {
    Tracker.autorun(() => {
        const isAuthenticated = !!Meteor.userId();
        const routes = getRoutes(isAuthenticated);

        ReactDOM.render(routes, document.getElementById("render-target"));
    });
});
