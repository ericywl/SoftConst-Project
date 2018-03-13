import expect from "expect";

import { MessagesDB } from "./messages";
import { GroupsDB } from "./groups";

if (Meteor.isServer) {
    describe("messages", function() {
        beforeEach(function() {
            MessagesDB.remove({});
            GroupsDB.remove({});
        });

        describe("messagesInsert", function() {
            it("should insert new message", function() {
                const userId = "testId";
                const partialMsg = {
                    groupId: "groupId1",
                    content: "Hello this is bob"
                };
                const userDisplayName = "someName";

                const _id = Meteor.server.method_handlers.messagesInsert.apply(
                    { userId },
                    [partialMsg, userDisplayName]
                );

                expect(MessagesDB.findOne({ _id, userId })).toBeTruthy();
            });

            it("should update group's lastMessageAt", function() {
                const userId = "testId";
                const partialMsg = {
                    groupId: "groupId1",
                    content: "Hello this is bob"
                };
                const userDisplayName = "someName";

                GroupsDB.remove({});
                GroupsDB.insert({ _id: partialMsg.groupId, lastMessageAt: 0 });

                const _id = Meteor.server.method_handlers.messagesInsert.apply(
                    { userId },
                    [partialMsg, userDisplayName]
                );

                expect(MessagesDB.findOne({ _id, userId })).toBeTruthy();
                expect(
                    GroupsDB.findOne({ _id: partialMsg.groupId }).lastMessageAt
                ).toBeGreaterThan(0);
            });

            it("should throw error if invalid groupId", function() {
                const userId = "testId";
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
                const userId = "testId";
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
                const userId = "testId";
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
