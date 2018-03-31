import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import { TAB_TEXT_ARR } from "../../misc/constants";

export class PrivateTab extends React.Component {
    render() {
        return (
            <div className="tab-container__wrapper">
                <div className="tab-container">{this.renderTabs()}</div>
            </div>
        );
    }

    renderTabs() {
        return (
            <ul ref="tabs">
                {TAB_TEXT_ARR.map(tabText => {
                    let tabSelectedClass = "";
                    if (tabText === this.props.selectedTab) {
                        tabSelectedClass = " tab__box--selected";
                    }

                    return (
                        <li name={tabText} key={tabText} className="tab">
                            <div
                                name={tabText}
                                className={"tab__box" + tabSelectedClass}
                                onClick={this.handleOnClick.bind(this)}
                            >
                                {tabText.toUpperCase()}
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    handleOnClick(event) {
        event.preventDefault();
        const name = event.target.getAttribute("name");

        if (this.props.session.get("selectedTab") !== name) {
            Array.from(this.refs.tabs.children).forEach(tab => {
                tab.children[0].classList.remove("tab__box--selected");
            });

            event.target.classList.add("tab__box--selected");
            this.props.session.set("selectedTab", name);
            this.props.session.set("searchQuery", "");
            this.props.session.set("sentToGroup", "");
            this.props.session.set("isNavOpen", false);
            this.props.session.set("isModalOpen", false);
        }
    }
}

export default withTracker(() => {
    const selectedTab = Session.get("selectedTab");

    return {
        session: Session,
        selectedTab
    };
})(PrivateTab);
