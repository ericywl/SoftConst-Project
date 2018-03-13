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
            const username = "Eric1";
            const email = "eric@test.com";
            const password = "password123";

            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            wrapper.ref("username").value = username;
            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");

            expect(spy.calls[0].arguments[0]).toEqual({
                username,
                email,
                password
            });
        });

        it("should set error if invalid username", function() {
            const username1 = "";
            const username2 = "ThisIsAVeryLongusernameThatWillFailTheTest";
            const email = "eric@test.com";
            const password = "password123";

            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            // submit password, email and invalid username (empty)
            wrapper.ref("username").value = username1;
            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");
            expect(wrapper.state("error").length).toBeGreaterThan(0);

            // change username field to invalid username2 (too long)
            wrapper.ref("username").value = username2;
            wrapper.find("form").simulate("submit");
            expect(wrapper.state("error").length).toBeGreaterThan(0);
        });

        it("should set error if invalid email", function() {
            const username = "Eric1";
            const email = "eric";
            const password = "password123";

            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            // submit username, password and invalid email
            wrapper.ref("username").value = username;
            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");
            expect(wrapper.state("error").length).toBeGreaterThan(0);
        });

        it("should set error if invalid password", function() {
            const username = "Eric1";
            const email = "eric@test.com";
            const password1 = "pass";
            const password2 =
                "passwordkmlwner1ol301-lkm34A;lsdfs-dsAE3ml02dajsdkasdfasfrj56";

            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            // submit username, email and invalid password1 (too short)
            wrapper.ref("username").value = username;
            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password1;
            wrapper.find("form").simulate("submit");
            expect(wrapper.state("error").length).toBeGreaterThan(0);

            // change password field to invalid password2 (too long)
            wrapper.ref("password").value = password2;
            wrapper.find("form").simulate("submit");
            expect(wrapper.state("error").length).toBeGreaterThan(0);
        });

        it("should set state error to createUser callback error", function() {
            // simulate an existing user in database
            Accounts.createUser({
                username: "Eric1",
                email: "existing@db.com",
                password: "password123"
            });

            const username = "RandName";
            const email = "existing@db.com";
            const password = "password123";
            const reason = "Some error happened!";

            const spy = expect.createSpy();
            const wrapper = mount(<Signup createUser={spy} isTesting={true} />);

            // try to create user with same email
            wrapper.ref("username").value = username;
            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");

            // call the callback function with a reason
            spy.calls[0].arguments[1]({ reason });
            expect(wrapper.state("error")).toBe(reason);

            // call the callback function with nothing
            spy.calls[0].arguments[1]();
            expect(wrapper.state("error").length).toBe(0);
        });
    });
}
