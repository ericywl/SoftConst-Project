import expect from "expect";

import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import moment from "moment";

// API
import { GroupsDB } from "../api/groups";
import { AdminsDB } from "../api/admins";
import { ProfilesDB } from "../api/profiles";
import { DsbjsDB } from "../api/dsbjs";
import {
    //checkAccess,
    //checkUserExist,
    searchFilterBeforeSet,
    searchFilterBeforeFetch,
    tagFilter,
    spaceFilter,
    numberFilter,
    //filterItemsByQuery,
    capitalizeFirstLetter,
    validateGroup,
    validateGroupId,
    validateDsbj,
    //validateMessage,
    validateUserDisplayName
} from "./methods";

if (Meteor.isServer) {
    describe("misc methods", function() {
        describe("searchFilterBeforeSet", function() {
            it("should filter off invalid characters for session variable", function() {
                const res = searchFilterBeforeSet("@!#$%^&*()+-=food 123");
                expect(res).toBe("#food 123");
            });
        });

        describe("searchFilterBeforeFetch", function() {
            it("should filter off invalid characters for search bar", function() {
                const res = searchFilterBeforeFetch("@!#$%^&*()  +-=food_123");
                expect(res).toBe("#food_123");
            });
        });

        describe("tagFilter", function() {
            it("should filter off invalid characters for tags", function() {
                const res = tagFilter("@!#$%^&*()+-=food 123");
                expect(res).toBe("food 123");
            });
        });

        describe("spaceFilter", function() {
            it("should filter off whitespaces", function() {
                const res = spaceFilter("@!#$%^&*()+-=food    123");
                expect(res).toBe("@!#$%^&*()+-=food 123");
            });
        });

        describe("numberFilter", function() {
            it("should filter off all characters that are not digits", function() {
                const res = numberFilter("@!#$%^&*()+-=food 123");
                expect(res).toBe("123");
            });
        });

        describe("capitalizeFirstLetter", function() {
            it("capitalize the first letter of the input", function() {
                const res = capitalizeFirstLetter("food");
                expect(res).toBe("Food");
            });

            it("does nothing if it is not a alphabet", function() {
                const res = capitalizeFirstLetter("$food");
                expect(res).toBe("$food");
            });
        });

        describe("validateGroup", function() {
            it("should allow valid name and description", function() {
                const validGroup = {
                    name: "valid group name",
                    description: "valid description"
                };
                const res = validateGroup(validGroup);
                expect(res).toBe(true);
            });

            it("should reject invalid group name", function() {
                const invalidNameGroup = {
                    name: "a",
                    description: "valid description"
                };

                expect(() => {
                    validateNewUserClient(invalidNameGroup);
                }).toThrow();

                invalidNameGroup.name =
                    "Invalid group name because the name is too long";

                expect(() => {
                    validateNewUserClient(invalidNameGroup);
                }).toThrow();

                invalidNameGroup.name = 123;
                expect(() => {
                    validateNewUserClient(invalidNameGroup);
                }).toThrow();
            });

            it("should reject descriptions that are too long", function() {
                const invalidDescriptionGroup = {
                    name: "valid group name",
                    description:
                        "invalid description invalid description invalid description invalid description "
                };

                expect(() => {
                    validateNewUserClient(invalidDescriptionGroup);
                }).toThrow();
            });
        });

        describe("validateGroupId", function() {
            it("should allow valid group Id", function() {
                const res = validateGroupId("valid group Id");
                expect(res).toBe(true);
            });

            it("should reject invalid group Id", function() {
                expect(() => {
                    validateGroupId(
                        "Invalid group Id because the group Id is too long"
                    );
                }).toThrow();
                expect(() => {
                    validateGroupId(123);
                }).toThrow();
            });
        });

        describe("validateDSBJ", function() {
            it("should allow valid DSBJ", function() {
                const partialDSBJ = {
                    name: "valid DSBJ",
                    description: "This is a valid DSBJ",
                    timeout: 10,
                    numberReq: 4
                };
                expect(validateDsbj(partialDSBJ)).toBe(true);
            });

            it("should reject invalid DSBJ name", function() {
                const partialDSBJ = {
                    name: "invalid DSBJ name because it is too long",
                    description: "This is a valid DSBJ",
                    timeout: 10,
                    numberReq: 4
                };

                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();

                partialDSBJ.name = "a";
                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();

                partialDSBJ.name = 12;
                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();
            });

            it("should reject invalid DSBJ description", function() {
                const partialDSBJ = {
                    name: "valid DSBJ",
                    description:
                        "This is a not a valid DSBJ because the description is too lengthy and is therefore rejected. This is a not a valid DSBJ because the description is too lengthy and is therefore rejected",
                    timeout: 10,
                    numberReq: 4
                };
                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();

                partialDSBJ.description = 12;
                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();
            });

            it("should reject invalid timeout", function() {
                const partialDSBJ = {
                    name: "valid DSBJ",
                    description: "This is a valid DSBJ",
                    timeout: "a",
                    numberReq: 4
                };
                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();

                (partialDSBJ.timeout = -1),
                    expect(() => {
                        validateDsbj(partialDSBJ);
                    }).toThrow();

                (partialDSBJ.timeout = 1234),
                    expect(() => {
                        validateDsbj(partialDSBJ);
                    }).toThrow();
            });

            it("should reject invalid number of requests", function() {
                const partialDSBJ = {
                    name: "valid DSBJ",
                    description: "This is a valid DSBJ",
                    timeout: 10,
                    numberReq: "a"
                };
                expect(() => {
                    validateDsbj(partialDSBJ);
                }).toThrow();

                (partialDSBJ.numberReq = -1),
                    expect(() => {
                        validateDsbj(partialDSBJ);
                    }).toThrow();

                (partialDSBJ.numberReq = 123),
                    expect(() => {
                        validateDsbj(partialDSBJ);
                    }).toThrow();
            });
        });

        describe("validateUserDisplayName", function() {
            it("should allow valid display names", function() {
                expect(validateUserDisplayName("valid display name")).toBe(
                    true
                );
            });

            it("should reject invalid display names", function() {
                expect(() => {
                    validateUserDisplayName(
                        "Invalid display name because it is too long"
                    );
                }).toThrow();

                expect(() => {
                    validateUserDisplayName("a");
                }).toThrow();

                expect(() => {
                    validateUserDisplayName(true);
                }).toThrow();
            });
        });
    });
}
