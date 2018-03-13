import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

import MessageList from "./MessageList";
import ChatAreaHeader from "./ChatAreaHeader";
import ChatAreaFooter from "./ChatAreaFooter";
import { GroupsDB } from "../../../api/groups";

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
                <ChatAreaHeader />

                <FlipMove maintainContainerHeight={true}>
                    <MessageList />
                </FlipMove>

                <ChatAreaFooter selectedGroupId={this.props.selectedGroupId} />
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    return {
        selectedGroupId
    };
})(ChatArea);
