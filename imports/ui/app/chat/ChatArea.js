import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import MessageList from "./MessageList";
import ChatAreaFooter from "./ChatAreaFooter";

export class ChatArea extends React.Component {
    render() {
        if (!this.props.selectedRoomId) {
            return (
                <div>
                    <p>Select a room.</p>
                </div>
            );
        }

        return (
            <div>
                <div>
                    <MessageList selectedRoomId={this.props.selectedRoomId} />
                </div>

                <div>
                    <ChatAreaFooter
                        selectedRoomId={this.props.selectedRoomId}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedRoomId = Session.get("selectedRoomId");

    return { selectedRoomId };
})(ChatArea);
