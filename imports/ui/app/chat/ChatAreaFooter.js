import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class ChatAreaFooter extends React.Component {
    handleSubmitMessage(event) {
        event.preventDefault();
        const input = this.refs.msgInput.value.trim();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmitMessage.bind(this)}>
                    <input ref="msgInput" type="text" />
                </form>
            </div>
        );
    }
}

export default ChatAreaFooter;
