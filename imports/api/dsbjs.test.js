import expect from "expect";

import { DsbjsDB } from "./dsbjs";

if (Meteor.isServer) {
    describe("dsbjs", function() {
        const userId = "userId1";
        const dsbjId = "newDsbjId1";
        beforeEach(function() {
            DsbjsDB.remove({});
            DsbjsDB.insert({ _id: dsbjId, createdBy: userId });
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

            it("should throw error if invalid name", function() {
                const partialDsbjInvalidName = {
                    name: "M",
                    description: "hello",
                    timeout: 10,
                    numberReq: 4
                };

                expect(() =>
                    Meteor.server.method_handlers.dsbjsInsert.apply(
                        { userId },
                        [partialDsbjInvalidName]
                    )
                ).toThrow();
            });

            it("should throw error if invalid description", function() {
                const partialDsbjInvalidDesc = {
                    name: "Ayy1213",
                    description:
                        ".kndf,n23or1hnfa09f2n124n2k12p0difa-smasldk" +
                        "asdajskjnkjasndkjneroiho341091203812097348953" +
                        "k4b23kj23nlkdfamslkdmasa09sdnlk2elk1oasu0as9d" +
                        "kanjknASDG@#4lj1n341k0fnskdmf2340mlfgldmh20aja" +
                        "bb1239usd0sdfsd23j4n3n42k3j42349",
                    timeout: 5,
                    numberReq: 11
                };

                expect(() =>
                    Meteor.server.method_handlers.dsbjsInsert.apply(
                        { userId },
                        [partialDsbjInvalidDesc]
                    )
                ).toThrow();
            });

            it("should throw error if invalid timeout", function() {
                const partialDsbjInvalidTimeout = {
                    name: "ggwp.com",
                    description: "win games",
                    timeout: 200,
                    numberReq: 24
                };

                expect(() =>
                    Meteor.server.method_handlers.dsbjsInsert.apply(
                        { userId },
                        [partialDsbjInvalidTimeout]
                    )
                ).toThrow();
            });

            it("should throw error if invalid number requirement", function() {
                const partialDsbjInvalidNumberReq = {
                    name: "my first group",
                    description: "yee",
                    timeout: 150,
                    numberReq: -2
                };

                expect(() =>
                    Meteor.server.method_handlers.dsbjsInsert.apply(
                        { userId },
                        [partialDsbjInvalidNumberReq]
                    )
                ).toThrow();
            });
        });

        describe("dsbjsRemove", function() {
            it("should remove dsbj event", function() {
                Meteor.server.method_handlers.dsbjsRemove.apply({ userId }, [
                    dsbjId
                ]);

                expect(DsbjsDB.findOne({ _id: dsbjId })).toBeFalsy();
            });
        });
    });
}
