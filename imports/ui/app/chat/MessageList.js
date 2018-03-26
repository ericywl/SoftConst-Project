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
        this.shouldScroll = false;
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
        // console.log(nextProps, nextState, nextContext);
        const currGroupId = this.props.selectedGroupId;
        const nextGroupId = nextProps.selectedGroupId;

        const { messageList } = this.refs;
        const scrollBottom =
            messageList.scrollHeight - messageList.clientHeight;

        if (this.scrollPositions[nextGroupId] === undefined) {
            console.log("new");
        }

        this.shouldScroll = Math.abs(messageList.scrollTop - scrollBottom) < 1;
        if (nextGroupId !== currGroupId) {
            this.shouldScroll = false;
            // console.log(shouldScroll);
            this.scrollPositions[currGroupId] = messageList.scrollTop;
            return;
        }

        if (this.props.messages.length !== 0) {
            const messages = this.props.messages;
            const lastMessage = messages[messages.length - 1];
            const byUser = lastMessage.userId === Meteor.userId();
            const recent =
                Math.abs(lastMessage.sentAt - moment().valueOf()) < 100;

            this.shouldScroll |= recent && byUser;
        } else {
            this.shouldScroll = false;
        }
    }

    componentDidUpdate() {
        console.log(this.shouldScroll);
        if (this.shouldScroll) {
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
