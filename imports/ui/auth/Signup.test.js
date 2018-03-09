import React from "react";
import expect from "expect";
import { mount } from "enzyme";

import { Signup } from "./Signup";

if (Meteor.isClient) {
    describe("Signup", function() {
        it("should show error messages", function() {
            const error = "This is not working";
            const wrapper = mount(
                <Signup createUser={() => {}} isTesting={true} />
            );

            wrapper.setState({ error });
            expect(wrapper.find("p").text()).toBe(error);

            wrapper.setState({ error: "" });
            expect(wrapper.find("p").length).toBe(0);
        });

        it("should call createUser with the form data", function() {
            const email = "eric@test.com";
            const password = "password123";
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");

            expect(spy.calls[0].arguments[0]).toEqual({ email, password });
        });

        it("should set error if invalid email", function() {
            const email = "eric";
            const password = "password123";
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");

            expect(wrapper.state("error").length).toBeGreaterThan(0);
        });

        it("should set error if password too short or too long", function() {
            const email = "eric@test.com";
            const password1 = "pass";
            const password2 =
                "passwordpasswordpasswordpasswordpasswordpasswordpassword";
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password1;
            wrapper.find("form").simulate("submit");

            expect(wrapper.state("error").length).toBeGreaterThan(0);

            wrapper.ref("password").value = password2;
            wrapper.find("form").simulate("submit");

            expect(wrapper.state("error").length).toBeGreaterThan(0);
        });

        it("should set state error to createUser callback error", function() {
            Accounts.createUser({
                email: "existing@db.com",
                password: "password123"
            });

            const email = "existing@db.com";
            const password = "password123";
            const reason = "shit failed";
            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");

            spy.calls[0].arguments[1]({ reason });
            expect(wrapper.state("error")).toBe(reason);

            spy.calls[0].arguments[1]();
            expect(wrapper.state("error").length).toBe(0);
        });
    });
}
