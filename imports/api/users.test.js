import expect from "expect";

import { validateNewUserClient, validateNewUserServer } from "./users";

// test client methods
if (Meteor.isClient) {
    describe("users", function() {
        it("should allow valid user email and password", function() {
            const validUser = {
                displayName: "TestUser1",
                email: "test@example.com",
                password: "password"
            };
            const res = validateNewUserClient(validUser);
            expect(res).toBe(true);
        });

        it("should reject invalid displayName", function() {
            const invalidDisplayNameUser = {
                displayName: "1",
                email: "invalidEmail",
                password: "password"
            };

            expect(() => {
                validateNewUserClient(invalidDisplayNameUser);
            }).toThrow();
        });

        it("should reject invalid user email", function() {
            const invalidEmailUser = {
                displayName: "TestUser1",
                email: "invalidEmail",
                password: "password"
            };

            expect(() => {
                validateNewUserClient(invalidEmailUser);
            }).toThrow();
        });

        it("should reject invalid password", function() {
            const invalidPasswordUser = {
                displayName: "TestUser1",
                email: "test@example.com",
                password: "pw"
            };

            expect(() => {
                validateNewUserClient(invalidPasswordUser);
            }).toThrow();
        });
    });
}

// test server methods
if (Meteor.isServer) {
    describe("users", function() {
        it("should allow valid email address and displayName", function() {
            const testUser = {
                emails: [
                    {
                        address: "Test@example.com"
                    }
                ],
                displayName: "Nice Name"
            };
            const res = validateNewUserServer(testUser);

            expect(res).toBe(true);
        });

        it("should reject invalid displayName", function() {
            const invalidDisplayNameUser = {
                displayName: "a",
                emails: [
                    {
                        address: "valid@example.com"
                    }
                ]
            };
        });

        it("should reject invalid email", function() {
            const invalidEmailUser = {
                displayName: "testUser",
                emails: [
                    {
                        address: "Testcom"
                    }
                ],
                displayName: "Is Valid Name"
            };

            expect(() => {
                validateNewUserServer(testUser);
            }).toThrow();
        });
    });
}
