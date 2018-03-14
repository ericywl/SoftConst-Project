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
                    <p>Please select a group to start chatting.</p>
                </div>
            );
        }

        return (
            <div>
                <ChatAreaHeader />

                <FlipMove maintainContainerHeight={true}>
                    <MessageList />
                </FlipMove>

                <ChatAreaFooter />
            </div>
        );
    }
}

ChatArea.propTypes = {
    selectedGroupId: PropTypes.string.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    return {
        selectedGroupId
    };
})(ChatArea);
