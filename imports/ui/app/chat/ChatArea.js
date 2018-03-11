import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import MessageList from "./MessageList";
import ChatAreaFooter from "./ChatAreaFooter";

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
                <div>
                    <MessageList selectedGroupId={this.props.selectedGroupId} />
                </div>

                <div>
                    <ChatAreaFooter
                        selectedGroupId={this.props.selectedGroupId}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");

    return { selectedGroupId };
})(ChatArea);
