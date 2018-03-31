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
                    isOwner={this.props.isOwner}
                    isModerator={this.props.isModerator}
                />

                <ChatAreaBody
                    notInGroup={this.props.notInGroup}
                    selectedGroupId={this.props.selectedGroup._id}
                />

                <ChatAreaFooter
                    notInGroup={this.props.notInGroup}
                    isOwner={this.props.isOwner}
                    isModerator={this.props.isModerator}
                />
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
    Meteor.subscribe("profiles");
    Meteor.subscribe("groups");

    const userProfile = ProfilesDB.find().fetch()[0];
    const userGroups = userProfile ? userProfile.groups : [];

    const selectedGroup = GroupsDB.findOne({ _id: selectedGroupId });
    const isOwner = selectedGroup
        ? selectedGroup.ownedBy === Meteor.userId()
        : false;
    const isModerator = selectedGroup
        ? selectedGroup.moderators.includes(Meteor.userId())
        : false;

    return {
        isOwner,
        isModerator,
        selectedGroup,
        notInGroup: !userGroups.includes(selectedGroupId)
    };
})(ChatArea);
