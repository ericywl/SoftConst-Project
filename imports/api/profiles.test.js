import expect from "expect";

import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("profiles", function() {
        const userId = "testId";
        beforeEach(function() {
            
            ProfilesDB.remove({});
            ProfilesDB.insert({_id: userId, groups:[]});
        });

        describe("profilesJoinGroup", function() {
            it("should allow profile to join group", function() {
                Meteor.server.method_handlers.profilesJoinGroup.apply(
                    { userId },
                    ["group1"]
                );

                expect(ProfilesDB.findOne({ _id: userId })).groups.includes("group1");
            });

            it("should throw error if invalid groupId", function() {
                const partialMsg = {
                    groupId: 321,
                    content: "Hello this is bob"
                };
                const userDisplayName = "someName";

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg, userDisplayName]
                    )
                ).toThrow();
            });

            it("should throw error if invalid content", function() {
                const partialMsg = {
                    groupId: "validGid",
                    content: []
                };
                const userDisplayName = "someName";

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg, userDisplayName]
                    )
                ).toThrow();
            });

            it("should throw error if invalid displayName", function() {
                const partialMsg = {
                    groupId: "validGid",
                    content: "my body"
                };
                const userDisplayName = "abcdefghijklmnopqrstuvwxyz1234567890";

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg, userDisplayName]
                    )
                ).toThrow();
            });
        });
    });
}
