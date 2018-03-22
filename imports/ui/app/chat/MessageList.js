// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import { Message } from "./Message";

// APIs
import { MessagesDB } from "../../../api/messages";

export class MessageList extends React.Component {
    render() {
        if (!this.props.messages) {
            return <p>Nothing here...</p>;
        }

        return (
            <div className="message-list">
                {this.props.messages.map(message => {
                    return <Message key={message._id} message={message} />;
                })}

                <div
                    style={{ float: "left", clear: "both" }}
                    ref={el => {
                        this.messagesEnd = el;
                    }}
                />
            </div>
        );
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("messagesByGroup", selectedGroupId);

    return {
        messages: MessagesDB.find().fetch()
    };
})(MessageList);
