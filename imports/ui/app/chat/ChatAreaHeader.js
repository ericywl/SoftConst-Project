import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import ManageTagsModal from "./_ManageTagsModal";
import { GroupsDB } from "../../../api/groups";

export class ChatAreaHeader extends React.Component {
    render() {
        return (
            <div>
                {this.props.selectedGroup ? (
                    <h1>{this.props.selectedGroup.name}</h1>
                ) : (
                    undefined
                )}

                <button onClick={() => this.child.toggleModal()}>
                    {this.props.isModerator
                        ? "Manage Group Tags"
                        : "View Group Tags"}
                </button>

                {this.props.selectedGroup ? (
                    <ManageTagsModal
                        isModerator={this.props.isModerator}
                        selectedGroup={this.props.selectedGroup}
                        meteorCall={this.props.meteorCall}
                        ref={ref => {
                            this.child = ref;
                        }}
                    />
                ) : (
                    undefined
                )}
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groups");

    const selectedGroup = GroupsDB.findOne({ _id: selectedGroupId });
    const isModerator = selectedGroup.moderators.includes(Meteor.userId());

    return {
        isModerator,
        selectedGroup,
        meteorCall: Meteor.call
    };
})(ChatAreaHeader);
