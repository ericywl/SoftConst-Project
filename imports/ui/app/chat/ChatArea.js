// Library
import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ChatAreaHeader from "./ChatAreaHeader";
import ChatAreaFooter from "./ChatAreaFooter";
import ChatAreaBody from "./ChatAreaBody";

// APIs
import { GroupsDB } from "../../../api/groups";
import { ProfilesDB } from "../../../api/profiles";

/**
 * Houses the list of messages, chat header and chat footer
 */
export class ChatArea extends React.Component {
    render() {
        if (!this.props.selectedGroup) {
            return (
                <div className="chat-area">
                    <p className="empty-chat-area">
                        Please select a group to start chatting.
                    </p>
                </div>
            );
        }

        return (
            <div className="chat-area">
                <ChatAreaHeader
                    selectedGroup={this.props.selectedGroup}
                    isModerator={this.props.isModerator}
                />

                <ChatAreaBody
                    notInGroup={this.props.notInGroup}
                    selectedGroupId={this.props.selectedGroup._id}
                />

                <ChatAreaFooter notInGroup={this.props.notInGroup} />
            </div>
        );
    }
}

ChatArea.propTypes = {
    isModerator: PropTypes.bool.isRequired,
    selectedGroup: PropTypes.object,
    notInGroup: PropTypes.bool.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groups");
    Meteor.subscribe("profiles");

    const userProfile = ProfilesDB.find().fetch()[0];
    const userGroups = userProfile ? userProfile.groups : [];

    const selectedGroup = GroupsDB.findOne({ _id: selectedGroupId });
    const isModerator = selectedGroup
        ? selectedGroup.moderators.includes(Meteor.userId())
        : false;

    return {
        isModerator,
        selectedGroup,
        notInGroup: !userGroups.includes(selectedGroupId)
    };
})(ChatArea);
