import expect from "expect";

import { GroupsDB } from "./groups";



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
