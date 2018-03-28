// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// API
import { capitalizeFirstLetter } from "../../../misc/methods";
import { buttonTextArr } from "../../../misc/constants";

export class GroupListSidebar extends React.Component {
    render() {
        return (
            <div className="item-list__sidebar">
                <div
                    ref="sidebarContent"
                    className="item-list__sidebar-content"
                >
                    {this.renderButtons()}
                </div>
            </div>
        );
    }

    renderButtons() {
        const isDisabled = !this.props.selectedGroupId || this.props.notInGroup;

        return buttonTextArr.map(text => {
            let selected = "";
            if (this.props.session.get("selectedRoom") === text) {
                selected = " button--sidebar-selected";
            }

            return (
                <button
                    key={text}
                    name={text}
                    className={"button--sidebar" + selected}
                    disabled={isDisabled}
                    onClick={this.handleOnClick.bind(this)}
                >
                    {capitalizeFirstLetter(text)}
                </button>
            );
        });
    }

    handleOnClick(event) {
        if (this.props.session.get("selectedRoom") !== event.target.name) {
            Array.from(this.refs.sidebarContent.children).forEach(child => {
                child.classList.remove("button--sidebar-selected");
            });

            event.target.classList.add("button--sidebar-selected");
            this.props.session.set("selectedRoom", event.target.name);
            this.props.session.set("isNavOpen", false);
        }
    }
}

GroupListSidebar.propTypes = {
    selectedGroupId: PropTypes.string.isRequired,
    session: PropTypes.object.isRequired,
    notInGroup: PropTypes.bool.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Session.set("selectedRoom", "messages");

    return {
        selectedGroupId,
        session: Session
    };
})(GroupListSidebar);
