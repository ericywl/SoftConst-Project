// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ManageTagsModal from "./_ManageTagsModal";

// APIs
import { GroupsDB } from "../../../api/groups";

export class ChatAreaHeader extends React.Component {
    render() {
        if (this.props.selectedGroup) {
            return (
                <div className="chat-area__header">
                    <h1 className="chat-area__header-title">
                        {this.props.selectedGroup.name}
                    </h1>

                    <button
                        className="button button__chat-area"
                        onClick={() => this.child.toggleModal()}
                    >
                        {this.props.isModerator
                            ? "Manage Group Tags"
                            : "View Group Tags"}
                    </button>

                    <ManageTagsModal
                        isModerator={this.props.isModerator}
                        selectedGroup={this.props.selectedGroup}
                        meteorCall={this.props.meteorCall}
                        ref={ref => {
                            this.child = ref;
                        }}
                    />
                </div>
            );
        }

        return undefined;
    }
}

ChatAreaHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    selectedGroup: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");

    return {
        meteorCall: Meteor.call
    };
})(ChatAreaHeader);
