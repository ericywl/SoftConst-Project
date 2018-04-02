import { Meteor } from "meteor/meteor";

import "../imports/api/users";
import "../imports/api/groups";
import "../imports/api/profiles";
import "../imports/api/groupsMessages";
import "../imports/api/dsbjsMessages";

import "../imports/startup/simpl-schema-config";

Meteor.startup(() => {});
