// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ManageTagsModal from "./_ManageTagsModal";

// APIs
import { PublicGroupsDB } from "../../../api/groups";

export class ChatAreaHeader extends React.Component {
    render() {
        return (
            <div>
                {this.props.selectedGroup ? (
                    <div>
                        <h1>{this.props.selectedGroup.name}</h1>

                        <button onClick={() => this.child.toggleModal()}>
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
                ) : (
                    undefined
                )}
            </div>
        );
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
