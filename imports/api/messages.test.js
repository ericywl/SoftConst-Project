import expect from "expect";

import { MessagesDB } from "./messages";
import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("messages", function() {
        const userId = "testId";
        const userDisplayName = "someName";
        const userId2 = "testId2";
        const userDisplayName2 = "abcdefghijklmnopqrstuvwxyz1234567890";

        beforeEach(function() {
            MessagesDB.remove({});
            GroupsDB.remove({});
            ProfilesDB.remove({});

            GroupsDB.insert({ _id: "groupId1", lastMessageAt: 0 });
            ProfilesDB.insert({ _id: userId, displayName: userDisplayName });
            ProfilesDB.insert({ _id: userId2, displayName: userDisplayName2 });
        });

        describe("messagesInsert", function() {
            it("should insert new message and update groupLastMessageAt", function() {
                const partialMsg = {
                    groupId: "groupId1",
                    room: "announcements",
                    content: "Hello this is bob"
                };

                const _id = Meteor.server.method_handlers.messagesInsert.apply(
                    { userId },
                    [partialMsg]
                );

                expect(MessagesDB.findOne({ _id, userId })).toBeTruthy();

                const groupLastMessageAt = GroupsDB.findOne({
                    _id: partialMsg.groupId
                }).lastMessageAt;
                expect(groupLastMessageAt).toBeGreaterThan(0);
            });

            it("should throw error if invalid groupId", function() {
                const partialMsg = {
                    groupId: 321,
                    room: "messages",
                    content: "Hello this is bob"
                };

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg]
                    )
                ).toThrow();
            });

            it("should throw error if invalid room", function() {
                const partialMsg = {
                    groupId: "groupId2",
                    room: "invalid",
                    content: "Hello this is bob"
                };
                const userDisplayName = "someName";

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg]
                    )
                ).toThrow();

                partialMsg.room = 123;
                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg]
                    )
                ).toThrow();
            });

            it("should throw error if invalid content", function() {
                const partialMsg = {
                    groupId: "validGid",
                    room: "messages",
                    content: []
                };

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId },
                        [partialMsg]
                    )
                ).toThrow();
            });

            it("should throw error if invalid displayName", function() {
                const partialMsg = {
                    groupId: "validGid",
                    room: "announcements",
                    content: "my body"
                };

                expect(() =>
                    Meteor.server.method_handlers.messagesInsert.apply(
                        { userId: userId2 },
                        [partialMsg]
                    )
                ).toThrow();
            });
        });
    });
}
