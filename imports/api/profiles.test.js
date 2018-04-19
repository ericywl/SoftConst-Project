import expect from "expect";

import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("profiles", function() {
        const userId = "testId";
        const groupId = "groupId1";
        const userId2 = "testId2";
        const tag = "food";
        beforeEach(function() {
            GroupsDB.remove({});
            ProfilesDB.remove({});

            GroupsDB.insert({
                _id: groupId,
                members: [],
                ownedBy: "notYou"
            });
            ProfilesDB.insert({ _id: userId, groups: [] });
            ProfilesDB.insert({ _id: userId2, groups: [], tags: [tag] });
        });

        describe("profileJoinGroup", function() {
            const userId = "testId";

            it("should allow a user to join a group", function() {
                Meteor.server.method_handlers.profilesJoinGroup.apply(
                    { userId },
                    ["groupId1"]
                );

                expect(
                    ProfilesDB.findOne({ _id: userId }).groups.includes(
                        "groupId1"
                    )
                ).toBeTruthy();
            });
        });

        describe("profilesTagAdd", function() {
            const userId = "testId";
            const tag = "#food";
            beforeEach(function() {
                ProfilesDB.remove({});
                ProfilesDB.insert({ _id: userId, groups: [] });
            });

            it("should add tags to the user profile", function() {
                Meteor.server.method_handlers.profilesTagAdd.apply({ userId }, [
                    tag
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).tags.includes("#food")
                ).toBeTruthy();
            });
        });

        // describe("profilesTagRemove", function() {
        //     it("should remove the tag from the user profile", function() {
        //         Meteor.server.method_handlers.profilesTagRemove.apply(
        //             { userId: userId2 },
        //             [userId2, tag]
        //         );

        //         expect(
        //             ProfilesDB.findOne({ _id: userId2 }).tags.includes(tag)
        //         ).toBeFalsy();
        //     });
        // });

        // describe("profilesUpdateDisplayName", function() {
        //     const userId = "testId";
        //     beforeEach(function() {
        //         ProfilesDB.remove({});
        //         ProfilesDB.insert({ _id: userId, groups: [] });
        //     });

        //     it("should update user profile's display name", function() {
        //         Meteor.server.method_handlers.profilesUpdateDisplayName.apply(
        //             { userId },
        //             []
        //         );

        //         expect(
        //             ProfilesDB.findOne({ _id: userId }).tags.includes("#food")
        //         ).toBeTruthy();
        //     });
        // });

        describe("profilesUpdateBio", function() {
            const userId = "testId";

            it("should update the user profile's biography", function() {
                Meteor.server.method_handlers.profilesUpdateBio.apply(
                    { userId },
                    ["User's biography"]
                );

                expect(
                    ProfilesDB.findOne({ _id: userId }).bio.includes(
                        "User's biography"
                    )
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
                    userId,
                    "User Display Name"
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).displayName.includes(
                        "User Display Name"
                    )
                ).toBeTruthy();
            });
        });
    });
}
