import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import ManageTagsModal from "./_ManageTagsModal";
import { GroupsDB } from "../../../api/groups";

export class ChatAreaHeader extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => this.child.toggleModal()}>
                    Manage group tags
                </button>

                <ManageTagsModal
                    selectedGroupId={this.props.selectedGroupId}
                    groupTags={this.props.groupTags}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.child = ref;
                    }}
                />
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groupTags", selectedGroupId);

    const group = GroupsDB.findOne();
    const groupTags = group && group.tags ? group.tags : [];

    return {
        selectedGroupId,
        groupTags,
        meteorCall: Meteor.call
    };
})(ChatAreaHeader);
