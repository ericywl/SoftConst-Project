import React from "react";
import expect from "expect";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import { Signup } from "./Signup";
import "../startup/test-setup";

if (Meteor.isClient) {
    describe("Signup", function() {
        it("should show or hide error message", function() {
            const error = "This is an error message.";
            const wrapper = mount(
                <MemoryRouter>
                    <Signup createUser={() => {}} />
                </MemoryRouter>
            );
            const instance = wrapper.find("Signup").instance();

            instance.setState({ error });
            wrapper.update();
            expect(wrapper.find("p").text()).toBe(error);

            instance.setState({ error: "" });
            wrapper.update();
            expect(wrapper.find("p").length).toBe(0);
        });

        it("should call createUser with the form data", function() {
            const email = "eric@test.com";
            const password = "password123";

            const spy = expect.createSpy();
            const wrapper = mount(
                <MemoryRouter>
                    <Signup createUser={spy} />
                </MemoryRouter>
            );
            const instance = wrapper.find("Signup").instance();

            instance.refs.email.value = email;
            instance.refs.password.value = password;
            wrapper.find("form").simulate("submit");

            expect(spy.calls[0].arguments[0]).toEqual({ email });
            expect(spy.calls[0].arguments[1]).toBe(password);
        });

        it("should set createUser callback errors", function() {
            const spy = expect.createSpy();
            const wrapper = mount(
                <MemoryRouter>
                    <Signup createUser={spy} />
                </MemoryRouter>
            );
            const instance = wrapper.find("Signup").instance();

            wrapper.find("form").simulate("submit");
            spy.calls[0].arguments[2]({});
            expect(instance.state.error).toNotBe("");

            spy.calls[0].arguments[2]();
            expect(instance.state.error).toBe("");
        });
    });
}
