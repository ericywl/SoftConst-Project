import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { RoomsDB } from "../../../api/rooms";
import Message from "./Message";
import ChatAreaFooter from "./ChatAreaFooter";

export class ChatArea extends React.Component {
    constructor(props) {
        super(props);
    }

    renderMessages() {
        return this.props.room.messages.map(message => {
            return <Message key={message._id} message={message} />;
        });
    }

    render() {
        if (!this.props.room) {
            return (
                <div>
                    <p>
                        {this.props.selectedRoomId
                            ? "Room not found!"
                            : "Pick or create a room to get started."}
                    </p>
                </div>
            );
        }

        return (
            <div>
                <p>Messages here...</p>
                <div>{this.renderMessages()}</div>
                <ChatAreaFooter />
            </div>
        );
    }
}

ChatArea.propTypes = {
    room: PropTypes.object,
    selectedRoomId: PropTypes.string,
    call: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedRoomId = Session.get("selectedRoomId");

    return {
        selectedRoomId,
        room: RoomsDB.findOne({ _id: selectedRoomId }),
        session: Session,
        call: Meteor.call
    };
})(ChatArea);
