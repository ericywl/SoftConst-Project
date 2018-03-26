import expect from "expect";

import { validateNewUserClient, validateNewUserServer } from "./users";
import { ProfilesDB } from "./profiles";

/* test client methods */
if (Meteor.isClient) {
    describe("users", function() {
        it("should allow valid user email and password", function() {
            const validUser = {
                _id: "testId1",
                username: "TestUser1",
                email: "test@example.com",
                password: "password"
            };
            const res = validateNewUserClient(validUser);
            expect(res).toBe(true);
        });

        it("should reject invalid username", function() {
            const invalidUsernameUser = {
                _id: "testId1",
                username: "1",
                email: "test@example.com",
                password: "password"
            };

            expect(() => {
                validateNewUserClient(invalidUsernameUser);
            }).toThrow();
        });

        it("should reject invalid user email", function() {
            const invalidEmailUser = {
                _id: "testId1",
                username: "TestUser1",
                email: "invalidEmail",
                password: "password"
            };

            expect(() => {
                validateNewUserClient(invalidEmailUser);
            }).toThrow();
        });

        it("should reject invalid password", function() {
            const invalidPasswordUser = {
                _id: "testId1",
                username: "TestUser1",
                email: "test@example.com",
                password: "pw"
            };

            expect(() => {
                validateNewUserClient(invalidPasswordUser);
            }).toThrow();
        });
    });
}

/* test server methods */
if (Meteor.isServer) {
    describe("users", function() {
        it("should allow valid email address and username", function() {
            const testUser = {
                _id: "testId1",
                emails: [
                    {
                        address: "Test@example.com"
                    }
                ],
                username: "Nice Name"
            };

            ProfilesDB.remove({});
            const res = validateNewUserServer(testUser);

            expect(res).toBe(true);
        });

        it("should reject invalid username", function() {
            const invalidusernameUser = {
                _id: "testId1",
                username: "asdf",
                emails: [
                    {
                        address: "valid@example.com"
                    }
                ]
            };

            expect(() => {
                validateNewUserServer(invalidusernameUser);
            }).toThrow();
        });

        it("should reject invalid email", function() {
            const invalidEmailUser = {
                _id: "testId1",
                emails: [
                    {
                        address: "Testcom"
                    }
                ],
                username: "Is Valid Name"
            };

            expect(() => {
                validateNewUserServer(testUser);
            }).toThrow();
        });
    });
}
