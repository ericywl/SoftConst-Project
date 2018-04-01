// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

// React Components
import { Message } from "./Message";

// APIs
import { GroupMessagesDB } from "../../../api/groupsMessages";

export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.changedGroup = true;
        this.autoScroll = false;
        this.scrollPositions = {};
    }

    render() {
        const notReady = !this.props.ready || this.props.messages.length == 0;

        return (
            <div className="message-list" ref="messageList">
                {notReady ? (
                    <div className="empty-message-list">
                        Nothing to see here.
                    </div>
                ) : (
                    this.props.messages.map(message => {
                        return <Message key={message._id} message={message} />;
                    })
                )}

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

    componentWillUpdate(nextProps, nextState, nextContext) {
        const currGroupId = this.props.selectedGroupId;
        const currRoom = this.props.selectedRoom;
        const nextGroupId = nextProps.selectedGroupId;
        const { messageList } = this.refs;

        if (this.scrollPositions[currGroupId] === undefined) {
            this.scrollPositions[currGroupId] = {};
        }

        // If user has changed list, save current scroll position
        if (nextGroupId !== currGroupId) {
            this.changedGroup = true;
            this.autoScroll = false;

            this.scrollPositions[currGroupId][currRoom] = Math.round(
                messageList.scrollTop
            );
            return;
        }

        // If user has changed room, save current scroll position
        const nextRoom = nextProps.selectedRoom;
        if (currRoom !== nextRoom) {
            this.changedGroup = true;
            this.autoScroll = false;

            this.scrollPositions[currGroupId][currRoom] = Math.round(
                messageList.scrollTop
            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { messageList } = this.refs;
        const groupId = this.props.selectedGroupId;
        const room = this.props.selectedRoom;

        if (messageList && this.props.ready) {
            let scrollPos;
            const scrollPosObj = this.scrollPositions[groupId];
            if (!scrollPosObj) {
                scrollPos = undefined;
            } else {
                scrollPos = scrollPosObj[room];
            }

            /* If user came from another list or room,
            move scroll to its previous position */
            if (this.changedGroup) {
                if (scrollPos !== undefined) {
                    messageList.scrollTop = scrollPos;
                } else {
                    messageList.scrollTop = messageList.scrollHeight;
                }

                this.changedGroup = false;
            }

            const messages = this.props.messages;
            const scrollBottom =
                messageList.scrollHeight - messageList.clientHeight;
            const scrollIsAtBottom =
                Math.abs(messageList.scrollTop - scrollBottom) < 1;

            // Notify new message if user scrollbar is not at bottom
            if (messages.length !== 0) {
                const lastMessage = messages[messages.length - 1];
                const notByUser = lastMessage.userId !== Meteor.userId();
                if (notByUser && !scrollIsAtBottom) {
                    // TODO: notify new message
                    console.log("new message");
                }
            }

            /* Scroll the bar to the bottom if the user sent the message
            OR if the scroll bar is at the bottom */
            const justSent = Session.get("sentToGroup") === groupId;
            if (scrollIsAtBottom || justSent) {
                this.scrollToBottom();
            }

            Session.set("sentToGroup", "");
        }
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedRoom = Session.get("selectedRoom");
    const handle = Meteor.subscribe("messagesByGroup", selectedGroupId);

    return {
        selectedGroupId,
        selectedRoom,
        ready: handle.ready(),
        messages: GroupMessagesDB.find({ room: selectedRoom }).fetch()
    };
})(MessageList);
