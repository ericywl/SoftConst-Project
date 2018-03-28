// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

// React Components
import { Message } from "./Message";

// APIs
import { MessagesDB } from "../../../api/messages";

export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.changedGroup = true;
        this.autoScroll = false;
        this.scrollPositions = {};
    }

    render() {
        return (
            <div className="message-list" ref="messageList">
                {this.props.messages.length == 0 ? (
                    <div>Nothing to see here.</div>
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
        const nextGroupId = nextProps.selectedGroupId;
        const { messageList } = this.refs;

        // If user has changed group, save current scroll position
        if (nextGroupId !== currGroupId) {
            this.changedGroup = true;
            this.autoScroll = false;
            this.scrollPositions[currGroupId] = Math.round(
                messageList.scrollTop
            );
            return;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { messageList } = this.refs;
        const groupId = this.props.selectedGroupId;

        if (messageList && this.props.ready) {
            const scrollPos = this.scrollPositions[groupId];
            /* If user came from another group, 
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
        ready: handle.ready(),
        messages: MessagesDB.find({ room: selectedRoom }).fetch()
    };
})(MessageList);
