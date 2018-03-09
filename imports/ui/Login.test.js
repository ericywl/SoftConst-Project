import React from "react";
import expect from "expect";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import { Login } from "./Login";
import "../startup/test-setup";

if (Meteor.isClient) {
    describe("Login", function() {
        it("should show error message", function() {
            const error = "This is an error message.";
            const wrapper = mount(
                <MemoryRouter>
                    <Login loginWithPassword={() => {}} />
                </MemoryRouter>
            );
            const instance = wrapper.find("Login").instance();

            instance.setState({ error });
            wrapper.update();
            expect(wrapper.find("p").text()).toBe(error);
        });

        it("should not show error message when there's none", function() {
            const wrapper = mount(
                <MemoryRouter>
                    <Login loginWithPassword={() => {}} />
                </MemoryRouter>
            );
            const instance = wrapper.find("Login").instance();

            instance.setState({ error: "" });
            wrapper.update();
            expect(wrapper.find("p").length).toBe(0);
        });

        it("should call loginWithPassword with the form data", function() {});

        it("should set loginWithPassword callback errors", function() {});
    });
}
