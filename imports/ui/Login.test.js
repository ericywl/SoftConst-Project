import React from "react";
import expect from "expect";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import { Login } from "./Login";
import "../startup/test-setup";
import "../startup/simpl-schema-config";

if (Meteor.isClient) {
    describe("Login", function() {
        it("should show error messages", function() {
            const error = "This is not working";
            const wrapper = mount(
                <Login loginWithPassword={() => {}} isTesting={true} />
            );

            wrapper.setState({ error });
            expect(wrapper.find("p").text()).toBe(error);

            wrapper.setState({ error: "" });
            expect(wrapper.find("p").length).toBe(0);
        });

        it("should call loginWithPassword with the form data", function() {
            const email = "eric@test.com";
            const password = "password123";
            const spy = expect.createSpy();
            const wrapper = mount(
                <Login loginWithPassword={spy} isTesting={true} />
            );

            wrapper.ref("email").value = email;
            wrapper.ref("password").value = password;
            wrapper.find("form").simulate("submit");

            expect(spy.calls[0].arguments[0]).toEqual({ email });
            expect(spy.calls[0].arguments[1]).toBe(password);
        });

        it("should set loginWithPassword callback errors", function() {
            const spy = expect.createSpy();
            const wrapper = mount(
                <Login loginWithPassword={spy} isTesting={true} />
            );

            wrapper.find("form").simulate("submit");

            spy.calls[0].arguments[2]({});
            expect(wrapper.state("error").length).toNotBe(0);

            spy.calls[0].arguments[2]();
            expect(wrapper.state("error").length).toBe(0);
        });
    });
}
