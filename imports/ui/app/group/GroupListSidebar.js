import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class GroupListSidebar extends React.Component {
    render() {
        const isDisabled = !this.props.selectedGroupId;

        return (
            <div className="item-list__sidebar">
                <div className="item-list__sidebar-content">
                    <button className="button--sidebar" disabled={isDisabled}>
                        Announcements
                    </button>
                    <button className="button--sidebar" disabled={isDisabled}>
                        Messages
                    </button>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    return { selectedGroupId: Session.get("selectedGroupId") };
})(GroupListSidebar);
