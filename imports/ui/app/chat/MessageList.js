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
        this.hasChecked = {};
        this.scrollPositions = {};
    }

    render() {
        const modalStyles = { overlay: { zIndex: 10 } };
        const notReady = !this.props.ready || this.props.messages.length == 0;
        const isAuth = this.props.isOwner || this.props.isModerator;

        return (
            <div
                className="message-list"
                ref="messageList"
                onScroll={this.scrollListener.bind(this)}
            >
                {notReady ? (
                    <div className="empty-message-list">
                        No {this.props.selectedRoom} to see here.
                    </div>
                ) : (
                    this.props.messages.map(message => {
                        return (
                            <Message
                                key={message._id}
                                message={message}
                                isAuth={isAuth}
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
                                isAuth={isAuth}
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

    scrollListener(event) {
        const { messageList } = this.refs;
        const scrollBottom =
            messageList.scrollHeight - messageList.clientHeight;
        const scrollIsAtBottom =
            Math.abs(messageList.scrollTop - scrollBottom) < 1;

        if (scrollIsAtBottom && this.props.session.get("newMessage")) {
            this.props.session.set("newMessage", false);
            if (this.hasChecked[this.props.selectedItemId] == undefined) {
                this.hasChecked[this.props.selectedItemId] = {};
            }

            this.hasChecked[this.props.selectedItemId][
                this.props.selectedRoom
            ] = true;
        }
    }

    scrollToBottom() {
        this.refs.messageList.scrollTop = this.refs.messageList.scrollHeight;
        //this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const currItemId = this.props.selectedItemId;
        const currRoom = this.props.selectedRoom;

        const nextItemId = nextProps.selectedItemId;
        const nextRoom = nextProps.selectedRoom;
        const { messageList } = this.refs;

        if (messageList) {
            if (this.scrollPositions[currItemId] === undefined) {
                this.scrollPositions[currItemId] = {};
            }

            // If user has changed list, save current scroll position
            if (nextItemId !== currItemId || currRoom !== nextRoom) {
                this.changedItem = true;
                this.scrollPositions[currItemId][currRoom] = Math.ceil(
                    messageList.scrollTop
                );
                return;
            }

            const scrollBottom =
                messageList.scrollHeight - messageList.clientHeight;
            const scrollIsAtBottom =
                scrollBottom !== 0 && messageList.scrollTop !== 0;
            Math.abs(messageList.scrollTop - scrollBottom) < 1;

            this.autoScroll = scrollIsAtBottom;
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
            } else if (this.props.messages.length > prevProps.messages.length) {
                if (this.hasChecked[this.props.selectedItemId] == undefined) {
                    this.hasChecked[this.props.selectedItemId] = {};
                }

                this.hasChecked[this.props.selectedItemId][
                    this.props.selectedRoom
                ] = false;
            }

            // Notify new message if user scrollbar is not at bottom
            const messages = this.props.messages;
            if (messages.length !== 0) {
                const lastMessage = messages[messages.length - 1];
                const notByUser = lastMessage.userId !== Meteor.userId();
                const checked = this.hasChecked[this.props.selectedItemId]
                    ? this.hasChecked[this.props.selectedItemId][
                          this.props.selectedRoom
                      ]
                    : false;

                if (notByUser && !this.autoScroll && !checked) {
                    if (!this.props.session.get("newMessage")) {
                        this.props.session.set("newMessage", true);
                    }
                }

                /* Scroll the bar to the bottom if the user sent the message
                OR if the scroll bar is at the bottom */
                const justSent =
                    this.props.session.get("sentToGroup") === itemId;
                if (this.autoScroll || justSent) {
                    this.props.session.set("sentToGroup", "");
                    this.scrollToBottom();
                    this.autoScroll = false;
                }
            }
        }
    }
}

MessageList.propTypes = {
    isOwner: PropTypes.bool.isRequired,
    isModerator: PropTypes.bool.isRequired,
    isGroupTab: PropTypes.bool.isRequired,
    selectedItemId: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    ready: PropTypes.bool.isRequired,
    session: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired,
    selectedRoom: PropTypes.string.isRequired
};

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
        messages = GroupsMessagesDB.find(
            { room: selectedRoom },
            { sort: { sentAt: 1 } }
        ).fetch();
    } else {
        handle = Meteor.subscribe("messagesByDsbj", selectedDsbjId);
        messages = DsbjsMessagesDB.find({}, { sort: { sentAt: 1 } }).fetch();
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
