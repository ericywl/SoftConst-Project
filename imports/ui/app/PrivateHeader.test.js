import React from "react";
import expect from "expect";
import { mount } from "enzyme";

import { PrivateHeader } from "./PrivateHeader";

if (Meteor.isClient) {
    describe("PrivateHeader", function() {
        it("should set button text to logout", function() {
            const title = "Test title";
            const wrapper = mount(
                <PrivateHeader
                    title={title}
                    handleLogout={() => {}}
                    toggleNav={() => {}}
                    isNavOpen={false}
                />
            );

            const buttonText = wrapper.find(".button").text();
            expect(buttonText).toBe("Logout");
        });

        it("should use title prop as h1 text", function() {
            const title = "Test title";
            const wrapper = mount(
                <PrivateHeader
                    title={title}
                    handleLogout={() => {}}
                    toggleNav={() => {}}
                    isNavOpen={false}
                />
            );

            const titleText = wrapper.find(".header__title").text();
            expect(titleText).toBe(title);
        });

        it("should call handleLogout on click", function() {
            const spy = expect.createSpy();
            const wrapper = mount(
                <PrivateHeader
                    title="Tittie title"
                    handleLogout={spy}
                    toggleNav={() => {}}
                    isNavOpen={false}
                />
            );

            // click logout button
            wrapper.find("button").simulate("click");
            expect(spy).toHaveBeenCalled();
        });

        it("should call toggleNav on click", function() {
            const spy = expect.createSpy();
            const wrapper = mount(
                <PrivateHeader
                    title="Tittie title"
                    handleLogout={() => {}}
                    toggleNav={spy}
                    isNavOpen={false}
                />
            );

            // click toggle imgButton
            wrapper.find(".header__nav-toggle").simulate("click");
            expect(spy).toHaveBeenCalled();
        });
    });
}
