import expect from "expect";

import { DsbjsDB } from "./dsbjs";

if (Meteor.isServer) {
    describe("dsbjs", function() {
        const userId = "userId1";
        beforeEach(function() {
            DsbjsDB.remove({});
        });

        describe("dsbjsInsert", function() {
            it("should insert new dsbj event", function() {
                const partialDsbj = {
                    name: "MyDsbj",
                    description: "hi",
                    timeout: 2,
                    numberReq: 0
                };

                const _id = Meteor.server.method_handlers.dsbjsInsert.apply(
                    { userId },
                    [partialDsbj]
                );

                expect(DsbjsDB.findOne({ _id })).toBeTruthy();
            });
        });
    });
}
