import expect from "expect";

import { validateNewUser } from "./users";

describe("users", function() {
    it("should allow valid user email and password", function() {
        const res = validateNewUser("test@example.com", "password");
        expect(res).toBe(true);
    });

    it("should reject invalid user email", function() {
        expect(() => {
            validateNewUser("testinvalid", "password");
        }).toThrow();
    });

    it("should reject invalid password", function() {
        expect(() => {
            validateNewUser("test@example.com", "p");
        }).toThrow();
    });
});
