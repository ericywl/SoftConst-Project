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
        const scrollBottom =
            messageList.scrollHeight - messageList.clientHeight;

        // Auto-scroll only if scroll bar is at bottom
        this.autoScroll = Math.abs(messageList.scrollTop - scrollBottom) < 1;

        // If user has changed group, save current scroll position
        if (nextGroupId !== currGroupId) {
            this.changedGroup = true;
            this.autoScroll = false;
            this.scrollPositions[currGroupId] = Math.round(
                messageList.scrollTop
            );
            return;
        }

        // Else, add an alternative condition for auto-scroll: user sent message
        if (this.props.messages.length !== 0) {
            const messages = this.props.messages;
            const lastMessage = messages[messages.length - 1];
            const byUser = lastMessage.userId === Meteor.userId();
            const recent =
                Math.abs(lastMessage.sentAt - moment().valueOf()) < 100;

            this.autoScroll |= recent && byUser;
        } else {
            this.autoScroll = false;
        }
    }

    componentDidUpdate() {
        const prevScrollPos = this.scrollPositions[this.props.selectedGroupId];
        if (this.changedGroup) {
            if (prevScrollPos === undefined) {
                this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight;
            } else {
                this.refs.messageList.scrollTop = prevScrollPos;
            }

            this.changedGroup = false;
        }

        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("messagesByGroup", selectedGroupId);

    return {
        selectedGroupId,
        messages: MessagesDB.find().fetch()
    };
})(MessageList);
