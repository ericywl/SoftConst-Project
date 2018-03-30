import expect from "expect";

import { GroupsDB } from "./groups";
import { validateNewGroup } from "./groups";

if (Meteor.isClient){
    describe("Groups", function() {
        it("should allow valid name and description", function() {
            const validGroup = {
                _id: "testId1",
                name: "valid group name",
                description: "valid description",
                isPrivate: true
            };
            const res = validateNewGroup(validGroup);
            expect(res).toBe(true);
        });

        it("should reject invalid group name", function() {
            const invalidNameGroup = {
                _id: "testId1",
                name: "a",
                description: "valid description",
                isPrivate: true
            };

            expect(() => {
                validateNewUserClient(invalidNameGroup);
            }).toThrow();
        });

        it("should reject descriptions that are too long", function() {
            const invalidDescriptionGroup = {
                _id: "testId1",
                name: "valid group name",
                description: "invalid description invalid description invalid description invalid description ",
                isPrivate: true
            };

            expect(() => {
                validateNewUserClient(invalidDescriptionGroup);
            }).toThrow();
        });

    });
}


if (Meteor.isServer) {
    // describe("Groups", function() {
    //     const userId = "testId";
    //     const validGroup = {
    //         _id: userId,
    //         name: "valid group name",
    //         description: "valid description",
    //         isPrivate: true
    //     };
    //     beforeEach(function() {
    //         GroupsDB.remove({});
    //     });

    //     it("should allow a user to create a group", function() {
    //         Meteor.server.method_handlers.groupsInsert.apply({ userId }, [
    //             validGroup
    //         ]);

    //         expect(
    //             GroupsDB.findOne({ _id: userId }).name.includes("valid group name")
    //         ).toBeTruthy();
    //     });
    // });
}
