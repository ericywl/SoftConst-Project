import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import ManageTagsModal from "./_ManageTagsModal";
import { GroupsDB } from "../../../api/groups";

export class ChatAreaHeader extends React.Component {
    render() {
        return (
            <div>
                <h1>{this.props.selectedGroup.name}</h1>

                <button onClick={() => this.child.toggleModal()}>
                    Manage group tags
                </button>

                <ManageTagsModal
                    selectedGroupId={this.props.selectedGroup._id}
                    groupTags={this.props.selectedGroup.tags}
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
    return {
        meteorCall: Meteor.call
    };
})(ChatAreaHeader);
