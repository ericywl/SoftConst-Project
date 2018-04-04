import expect from "expect";

import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("profiles", function() {
        const userId = "testId";
        beforeEach(function() {
            GroupsDB.insert({
                _id: "groupsId1",
                members: [],
                ownedBy: "notYou"
            });
            ProfilesDB.remove({});
            ProfilesDB.insert({ _id: userId, groups: [] });
        });
    });
}
