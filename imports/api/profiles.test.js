import expect from "expect";

import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("profiles", function() {
        const userId = "testId";
        beforeEach(function() {
            ProfilesDB.remove({});
            ProfilesDB.insert({ _id: userId, groups: [] });
        });

        it("should blabla", function() {
            Meteor.server.method_handlers.profilesJoinGroup.apply({ userId }, [
                "group1"
            ]);

            expect(
                ProfilesDB.findOne({ _id: userId }).groups.includes("group1")
            ).toBeTruthy();
        });
    });
}
