import expect from "expect";

import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("profiles", function() {
        describe("profileJoinGroup", function() {
            const userId = "testId";
            beforeEach(function() {
                ProfilesDB.remove({});
                ProfilesDB.insert({ _id: userId, groups: [] });
            });

            it("should allow a user to join a group", function() {
                Meteor.server.method_handlers.profilesJoinGroup.apply({ userId }, [
                    "group1"
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).groups.includes("group1")
                ).toBeTruthy();
            });
        });

        describe("profilesAddTag", function() {
            const userId = "testId";
            const tag = "#food"
            beforeEach(function() {
                ProfilesDB.remove({});
                ProfilesDB.insert({ _id: userId, groups: [] });
            });
    
            it("should add tags to the user profile", function() {
                Meteor.server.method_handlers.profilesAddTag.apply({ userId }, [
                    tag
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).tags.includes("#food")
                ).toBeTruthy();
            });
        });

        describe("profilesRemoveTag", function() {
            const userId = "testId";
            const tag = "#food"
            beforeEach(function() {
                ProfilesDB.remove({});
                ProfilesDB.insert({ _id: userId, groups: [] });
            });
    
            it("should add tags to the user profile", function() {
                Meteor.server.method_handlers.profilesAddTag.apply({ userId }, [
                    tag
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).tags.includes("#food")
                ).toBeTruthy();
            });
        });
        
    });
}