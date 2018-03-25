// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import { Message } from "./Message";

// APIs
import { MessagesDB } from "../../../api/messages";

export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.changedGroup = true;
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
        const newMessages = nextProps.messages;
        const { messageList } = this.refs;
        const scrollPosition = messageList.scrollTop;
        const scrollBottom =
            messageList.scrollHeight - messageList.clientHeight;

        if (this.props.selectedGroupId === nextProps.selectedGroupId) {
            this.shouldScroll = Math.abs(scrollPosition - scrollBottom) < 1;
            if (newMessages) {
                const len = newMessages.length - 1;
                this.shouldScroll = newMessages[len].userId === Meteor.userId();
            }
        } else {
            this.shouldScroll = false;
            this.changedGroup = true;
            this.scrollPositions[this.props.selectedGroupId] = Math.round(
                scrollPosition
            );
        }
    }

    componentDidUpdate() {
        const groupId = this.props.selectedGroupId;
        const previousScrollPos = this.scrollPositions[groupId];

        if (this.changedGroup) {
            if (previousScrollPos === undefined || previousScrollPos === null) {
                this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight;
            } else {
                this.refs.messageList.scrollTop = previousScrollPos;
            }
        }

        if (this.shouldScroll) {
            console.log("Hey");
            this.scrollToBottom();
        }

        this.changedGroup = false;
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
