import React from "react";
import ReactDOM from "react-dom";
import { Session } from "meteor/session";
import { Redirect } from "react-router-dom";

import history from "../api/history";
import { getRoutes } from "../routes/routes";
import "../startup/simpl-schema-config";

Tracker.autorun(() => {
    const selectedNoteId = Session.get("selectedNoteId");
    Session.set("isNavOpen", false);

    if (selectedNoteId) {
        history.replace(`/dashboard/${selectedNoteId}`);
    }
});

Tracker.autorun(() => {
    const isNavOpen = Session.get("isNavOpen");
    document.body.classList.toggle("nav-open", isNavOpen);
});

if (Meteor.isClient) {
    Meteor.startup(() => {
        Session.set("selectedNoteId", undefined);
        Session.set("searchQuery", "");
        Session.set("isNavOpen", false);

        Tracker.autorun(() => {
            const isAuthenticated = !!Meteor.userId();
            const routes = getRoutes(isAuthenticated);

            ReactDOM.render(routes, document.getElementById("render-target"));
        });
    });

    Meteor.subscribe("notes", () => Session.set("data_loaded", true));
}
