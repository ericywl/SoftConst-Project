import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { Message } from "./Message";
import { MessagesDB } from "../../../api/messages";

export class MessageList extends React.Component {
    render() {
        if (!this.props.messages) {
            return <p>Nothing here...</p>;
        }

        return this.props.messages.map(message => {
            return <Message key={message._id} message={message} />;
        });
    }
}

export default withTracker(() => {
    const selectedRoomId = Session.get("selectedRoomId");
    Meteor.subscribe("messagesByRoom", selectedRoomId);

    return {
        messages: MessagesDB.find().fetch()
    };
})(MessageList);
