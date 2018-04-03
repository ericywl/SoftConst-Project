// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class ChatAreaFooter extends React.Component {
    constructor(props) {
        super(props);
        this.groupInputs = {};
        this.state = {
            input: "",
            error: ""
        };
    }

    render() {
        let cannotSendToAnnouncements =
            this.props.selectedRoom === "announcements" && !this.props.isOwner;

        if (this.props.selectedTab === "groups") {
            connanotSenToAnnouncements =
                cannotSendToAnnouncements && !this.props.isModerator;
        }

        const disabledInput = this.props.notInItem || cannotSendToAnnouncements;
        const inputPlaceholder = this.props.notInItem
            ? "Join the list to chat!"
            : "";

        return (
            <div className="chat-area__footer">
                <form
                    className="chat-area__footer-form"
                    onSubmit={this.handleSubmitMessage.bind(this)}
                >
                    <input
                        disabled={disabledInput}
                        placeholder={inputPlaceholder}
                        ref="msgInput"
                        type="text"
                        value={this.state.input}
                        onChange={this.handleInputChange.bind(this)}
                    />
                </form>

                <div ref="errorBar" className="snackbar">
                    {this.state.error}
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        const currGroupId = this.props.selectedItemId;
        const prevGroupId = prevProps.selectedItemId;

        const currRoom = this.props.selectedRoom;
        const prevRoom = prevProps.selectedRoom;

        // Save and reload the message input field if user change list
        if (!!currGroupId && currGroupId !== prevGroupId) {
            if (this.groupInputs[prevGroupId] === undefined) {
                this.groupInputs[prevGroupId] = {};
            }

            this.groupInputs[prevGroupId][prevRoom] = prevState.input;
            const reloadedCurrGroupInput =
                this.groupInputs[currGroupId] === undefined
                    ? ""
                    : this.groupInputs[currGroupId][currRoom];

            this.setState({
                input: reloadedCurrGroupInput ? reloadedCurrGroupInput : ""
            });
        }
    }

    handleSubmitMessage(event) {
        event.preventDefault();
        if (this.state.input.trim() === "") return;

        const partialMsg = {
            dsbjId: this.props.selectedItemId,
            room: this.props.selectedRoom,
            content: this.state.input.trim()
        };

        const messagesInsert =
            this.props.selectedTab === "groups"
                ? "groupsMessagesInsert"
                : "dsbjsMessagesInsert";

        this.props.meteorCall(messagesInsert, partialMsg, (err, res) => {
            if (err) this.setState({ error: err.reason });

            if (res) {
                Session.set("sentToGroup", this.props.selectedItemId);
                this.setState({ input: "" });
            }
        });

        if (this.state.error) {
            this.showSnackbar();
        }
    }

    showSnackbar() {
        const errorBar = this.refs.errorBar;
        errorBar.classList.add("snackbar--show");
        setTimeout(() => {
            errorBar.classList.remove("snackbar--show");
            this.setState({ error: "" });
        }, 3000);
    }

    handleInputChange(event) {
        const input = event.target.value;
        this.setState({ input });
    }
}

ChatAreaFooter.propTypes = {
    notInItem: PropTypes.bool.isRequired,
    selectedItemId: PropTypes.string.isRequired,
    selectedRoom: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    const selectedRoom = Session.get("selectedRoom");

    return {
        selectedRoom,
        meteorCall: Meteor.call
    };
})(ChatAreaFooter);
