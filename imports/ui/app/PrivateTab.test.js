import React from "react";
import expect from "expect";
import { mount } from "enzyme";

import { PrivateTab } from "./PrivateTab";

import { TAB_TEXT_ARR } from "../../misc/constants";

if (Meteor.isClient) {
    describe("PrivateTab", function() {
        let session;
        beforeEach(function() {
            session = {
                set: expect.createSpy()
            };
        });

        it("should have two tabs with correct text", function() {
            const wrapper = mount(
                <PrivateTab selectedTab="groups" session={session} />
            );

            const tabs = wrapper.find(".tab__box");
            expect(tabs.length).toBe(2);
            tabs.forEach((el, index) =>
                expect(el.key()).toBe(TAB_TEXT_ARR[index])
            );
        });

        it("should change tab on click", function() {
            const wrapper = mount(
                <PrivateTab selectedTab={TAB_TEXT_ARR[0]} session={session} />
            );

            const div = wrapper
                .find(".tab__box")
                .filterWhere(el => !el.is(".tab__box--selected"));

            div.simulate("click");
            expect(session.set).toHaveBeenCalledWith("selectedTab", div.key());
        });
    });
}
