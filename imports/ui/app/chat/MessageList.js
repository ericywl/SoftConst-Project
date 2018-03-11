import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { MessagesDB } from "../../../api/messages";
import { Message } from "./Message";

export class MessageList extends React.Component {
    render() {
        return this.props.messages.map(message => {
            return <Message key={message._id} message={message} />;
        });
    }
}

export default withTracker(() => {
    const selectedRoomId = Session.get("selectedRoomId");
    Meteor.subscribe("messagesDB");

    return {
        messages: MessagesDB.find(
            { roomId: selectedRoomId },
            { sort: { sentAt: 1 } }
        ).fetch()
    };
})(MessageList);
