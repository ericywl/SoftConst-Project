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

            ProfilesDB.insert({ _id: userId, groups: [], tags: [] });
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
            it("should add tags to the user profile", function() {
                Meteor.server.method_handlers.profilesTagAdd.apply({ userId }, [
                    tag
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).tags.includes(tag)
                ).toBeTruthy();
            });
        });

        describe("profilesTagRemove", function() {
            it("should remove the tag", function() {
                Meteor.server.method_handlers.profilesTagRemove.apply(
                    { userId: userId2 },
                    [tag]
                );

                expect(
                    ProfilesDB.findOne({ _id: userId2 }).tags.includes(tag)
                ).toBeFalsy();
            });
        });

        describe("profilesUpdate", function() {
            it("should update the user profile", function() {
                Meteor.server.method_handlers.profilesUpdate.apply({ userId }, [
                    "MyNewName",
                    "User's biography"
                ]);

                expect(
                    ProfilesDB.findOne({ _id: userId }).bio.includes(
                        "User's biography"
                    )
                ).toBeTruthy();

                expect(ProfilesDB.findOne({ _id: userId }).displayName).toBe(
                    "MyNewName"
                );
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
