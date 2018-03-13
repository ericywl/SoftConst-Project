import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

import MessageList from "./MessageList";
import ChatAreaHeader from "./ChatAreaHeader";
import ChatAreaFooter from "./ChatAreaFooter";
import { GroupsDB } from "../../../api/groups";

/**
 * Houses the list of messages, chat header and chat footer
 */
export class ChatArea extends React.Component {
    render() {
        if (!this.props.selectedGroupId) {
            return (
                <div>
                    <p>Select a group.</p>
                </div>
            );
        }

        return (
            <div>
                <ChatAreaHeader selectedGroup={this.props.selectedGroup} />

                <FlipMove maintainContainerHeight={true}>
                    <MessageList />
                </FlipMove>

                <ChatAreaFooter selectedGroupId={this.props.selectedGroupId} />
            </div>
        );
    }
}

ChatArea.propTypes = {
    selectedGroupId: PropTypes.string.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groups", selectedGroupId);

    const selectedGroup = GroupsDB.findOne({ _id: selectedGroupId });

    return {
        selectedGroup,
        selectedGroupId
    };
})(ChatArea);
