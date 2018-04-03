// Library
import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import { Message } from "./Message";

// APIs
import { GroupsMessagesDB } from "../../../api/groupsMessages";
import { DsbjsMessagesDB } from "../../../api/dsbjsMessages";

export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalError: "",
            modalIsOpen: false,
            modalMessage: {}
        };

        this.changedItem = true;
        this.autoScroll = false;
        this.scrollPositions = {};
    }

    render() {
        const modalStyles = { overlay: { zIndex: 10 } };
        const notReady = !this.props.ready || this.props.messages.length == 0;

        return (
            <div className="message-list" ref="messageList">
                {notReady ? (
                    <div className="empty-message-list">
                        Nothing to see here.
                    </div>
                ) : (
                    this.props.messages.map(message => {
                        return (
                            <Message
                                key={message._id}
                                message={message}
                                removeMessage={this.openModal.bind(this)}
                            />
                        );
                    })
                )}

                <div
                    style={{ float: "left", clear: "both" }}
                    ref={el => {
                        this.messagesEnd = el;
                    }}
                />

                <Modal
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Remove Message"
                    onAfterOpen={() => {}}
                    onRequestClose={this.closeModal.bind(this)}
                    className="boxed-view__box boxed-view__box--el text-left"
                    overlayClassName="boxed-view boxed-view__modal"
                    shouldReturnFocusAfterClose={false}
                    style={modalStyles}
                >
                    {this.state.modalMessage !== {} ? (
                        <div>
                            <h2>Remove Message</h2>

                            {this.state.error ? (
                                <p>{this.state.error}</p>
                            ) : (
                                undefined
                            )}

                            <p className="remove-message__subtitle">
                                Are you sure you want to remove this message?
                            </p>

                            <Message
                                message={this.state.modalMessage}
                                removeMessage={undefined}
                            />

                            <div className="button__wrapper">
                                <div className="button__side-by-side">
                                    <button
                                        className="button button--greyed"
                                        onClick={this.closeModal.bind(this)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="button button--delete"
                                        onClick={this.removeMessage.bind(this)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        undefined
                    )}
                </Modal>
            </div>
        );
    }

    openModal(message) {
        this.setState({ modalMessage: message });
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    removeMessage() {
        const removeMsg = this.props.isGroupTab
            ? "groupsMessagesRemove"
            : "dsbjsMessagesRemove";

        this.props.meteorCall(
            removeMsg,
            this.state.modalMessage._id,
            (err, res) => {
                if (err) {
                    this.setState({ modalError: err.reason });
                } else {
                    this.closeModal();
                }
            }
        );
    }

    scrollToBottom() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const currItemId = this.props.selectedItemId;
        const currRoom = this.props.selectedRoom;

        const nextItemId = nextProps.selectedItemId;
        const { messageList } = this.refs;

        if (this.scrollPositions[currItemId] === undefined) {
            this.scrollPositions[currItemId] = {};
        }

        // If user has changed list, save current scroll position
        if (nextItemId !== currItemId) {
            this.changedItem = true;
            this.autoScroll = false;

            this.scrollPositions[currItemId][currRoom] = Math.round(
                messageList.scrollTop
            );
            return;
        }

        // If user has changed room, save current scroll position
        const nextRoom = nextProps.selectedRoom;

        if (currRoom !== nextRoom) {
            this.changedItem = true;
            this.autoScroll = false;

            this.scrollPositions[currItemId][currRoom] = Math.round(
                messageList.scrollTop
            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { messageList } = this.refs;
        const itemId = this.props.selectedItemId;
        const room = this.props.selectedRoom;

        if (messageList && this.props.ready) {
            let scrollPos;
            const scrollPosObj = this.scrollPositions[itemId];
            if (!scrollPosObj) {
                scrollPos = undefined;
            } else {
                scrollPos = scrollPosObj[room];
            }

            /* If user came from another list or room,
            move scroll to its previous position */
            if (this.changedItem) {
                if (scrollPos !== undefined) {
                    messageList.scrollTop = scrollPos;
                } else {
                    messageList.scrollTop = messageList.scrollHeight;
                }

                this.changedItem = false;
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
            const justSent = this.props.session.get("sentToGroup") === itemId;
            if (scrollIsAtBottom || justSent) {
                this.scrollToBottom();
            }

            this.props.session.set("sentToGroup", "");
        }
    }
}

export default withTracker(() => {
    const selectedTab = Session.get("selectedTab");
    const selectedRoom = Session.get("selectedRoom");
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedDsbjId = Session.get("selectedDsbjId");

    const isGroupTab = selectedTab === "groups";
    const selectedItemId = isGroupTab ? selectedGroupId : selectedDsbjId;

    let handle, messages;
    if (isGroupTab) {
        handle = Meteor.subscribe("messagesByGroup", selectedGroupId);
        messages = GroupsMessagesDB.find({ room: selectedRoom }).fetch();
    } else {
        handle = Meteor.subscribe("messagesByDsbj", selectedDsbjId);
        messages = DsbjsMessagesDB.find().fetch();
    }

    messages = messages.map(message => {
        return {
            ...message,
            isSender: message.userId === Meteor.userId()
        };
    });

    return {
        isGroupTab,
        selectedItemId,
        messages,
        ready: handle.ready(),
        session: Session,
        meteorCall: Meteor.call,
        selectedRoom: selectedTab === "groups" ? selectedRoom : "messages"
    };
})(MessageList);
