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

        // describe("profilesRemoveTag", function() {
        //     const userId = "testId";
        //     const tag = "#food"
        //     beforeEach(function() {
        //         ProfilesDB.remove({});
        //         ProfilesDB.insert({ _id: userId, groups: [], tags: ["#food"] });
        //     });
    
        //     it("should remove the tag from the user profile", function() {
        //         Meteor.server.method_handlers.profilesRemoveTag.apply({userId}, 
        //             [userId, tag]
        //         );
        //         expect(
        //             ProfilesDB.findOne({ _id: userId }).tags.includes("#food")
        //         ).toBeFalsy();
        //     });
        // });
        
        // describe("profilesUpdateDisplayName", function() {
        //     const userId = "testId";
        //     beforeEach(function() {
        //         ProfilesDB.remove({});
        //         ProfilesDB.insert({ _id: userId, groups: [] });
        //     });
    
        //     it("should update user profile's diaplay name", function() {
        //         Meteor.server.method_handlers.profilesUpdateDisplayName.apply({ userId }, [
        //         ]);

        //         expect(
        //             ProfilesDB.findOne({ _id: userId }).tags.includes("#food")
        //         ).toBeTruthy();
        //     });
        // });

        describe("profilesUpdateBio", function() {
            const userId = "testId";
            beforeEach(function() {
                ProfilesDB.remove({});
                ProfilesDB.insert({ _id: userId, groups: [] });
            });
    
            it("should update the user profile's biography", function() {
                Meteor.server.method_handlers.profilesUpdateBio.apply({ userId }, [
                    "User's biography"
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).bio.includes("User's biography")
                ).toBeTruthy();
            });
        });

        describe("profilesInsert", function() {
            const userId = "testId";
            beforeEach(function() {
                ProfilesDB.remove({});
            });
    
            it("should insert a new profile", function() {
                Meteor.server.method_handlers.profilesInsert.apply({}, [
                    userId, "User Display Name"
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).displayName.includes("User Display Name")
                ).toBeTruthy();
            });
        });

    });
}
