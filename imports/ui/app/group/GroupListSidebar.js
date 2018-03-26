import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class GroupListSidebar extends React.Component {
    render() {
        const isDisabled = !this.props.selectedGroupId;

        return (
            <div className="item-list__sidebar">
                <div
                    ref="sidebarContent"
                    className="item-list__sidebar-content"
                >
                    <button
                        className="button--sidebar"
                        disabled={isDisabled}
                        onClick={this.handleOnClick.bind(this)}
                    >
                        Announcements
                    </button>
                    <button
                        className="button--sidebar"
                        disabled={isDisabled}
                        onClick={this.handleOnClick.bind(this)}
                    >
                        Messages
                    </button>
                </div>
            </div>
        );
    }

    handleOnClick(event) {
        Array.from(this.refs.sidebarContent.children).forEach(child => {
            child.classList.remove("button--sidebar-selected");
        });

        event.target.classList.add("button--sidebar-selected");
    }
}

export default withTracker(() => {
    return { selectedGroupId: Session.get("selectedGroupId") };
})(GroupListSidebar);
