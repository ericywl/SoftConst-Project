import expect from "expect";

import { MessagesDB } from "./messages";
import { GroupsDB } from "./groups";
import { ProfilesDB } from "./profiles";

if (Meteor.isServer) {
    describe("messages", function() {
        const userId = "testId";
        beforeEach(function() {
            MessagesDB.remove({});
        });

        describe("messagesInsert", function() {
            it("should insert new message", function() {
                const partialMsg = {
                    groupId: "groupId1",
                    room: "announcements",
                    content: "Hello this is bob"
                };
                const userDisplayName = "someName";

                const _id = Meteor.server.method_handlers.messagesInsert.apply(
                    { userId },
                    [partialMsg, userDisplayName]
                );

                expect(MessagesDB.findOne({ _id, userId })).toBeTruthy();
            });

            it("should throw error if invalid groupId", function() {
                const partialMsg = {
                    groupId: 321,
                    room: "messages",
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
                        [partialMsg, userDisplayName]
                    )
                ).toThrow();

                partialMsg.room = 123;
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
                    room: "messages",
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
                    room: "announcements",
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
