import expect from "expect";

import { validateNewUserClient, validateNewUserServer } from "./users";

if (Meteor.isClient) {
    describe("users", function() {
        it("should allow valid user email and password", function() {
            const res = validateNewUserClient("test@example.com", "password");
            expect(res).toBe(true);
        });

        it("should reject invalid user email", function() {
            expect(() => {
                validateNewUserClient("testinvalid", "password");
            }).toThrow();
        });

        it("should reject invalid password", function() {
            expect(() => {
                validateNewUserClient("test@example.com", "p");
            }).toThrow();
        });
    });
}

if (Meteor.isServer) {
    describe("users", function() {
        it("should allow valid email address", function() {
            const testUser = {
                emails: [
                    {
                        address: "Test@example.com"
                    }
                ]
            };
            const res = validateNewUserServer(testUser);

            expect(res).toBe(true);
        });

        it("should reject invalid email", function() {
            const testUser = {
                emails: [
                    {
                        address: "Testom"
                    }
                ]
            };

            expect(() => {
                validateNewUserServer(testUser);
            }).toThrow();
        });
    });
}
