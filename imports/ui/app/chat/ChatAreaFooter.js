// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

// API
import { validateMessage } from "../../../misc/methods";

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
        const cannotSendToAnnouncements =
            this.props.selectedRoom === "announcements" &&
            !this.props.isModerator;

        const disabledInput =
            this.props.notInGroup || cannotSendToAnnouncements ? true : false;

        const placeholder = this.props.notInGroup
            ? "Join the group to chat!"
            : "";

        return (
            <div className="chat-area__footer">
                <form
                    className="chat-area__footer-form"
                    onSubmit={this.handleSubmitMessage.bind(this)}
                >
                    <input
                        disabled={disabledInput}
                        placeholder={placeholder}
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
        const currGroupId = this.props.selectedGroupId;
        const prevGroupId = prevProps.selectedGroupId;

        // Save and reload the message input field if user change group
        if (!!currGroupId && currGroupId !== prevGroupId) {
            this.groupInputs[prevGroupId] = prevState.input;
            const oldCurrGroupInput = this.groupInputs[currGroupId];
            this.setState({
                input: oldCurrGroupInput ? oldCurrGroupInput : ""
            });
        }
    }

    handleSubmitMessage(event) {
        event.preventDefault();
        if (this.state.input.trim() === "") return;

        const partialMsg = {
            groupId: this.props.selectedGroupId,
            room: this.props.selectedRoom,
            content: this.state.input.trim()
        };

        this.props.meteorCall("messagesInsert", partialMsg, (err, res) => {
            if (err) this.setState({ error: err.reason });

            if (res) {
                Session.set("sentToGroup", this.props.selectedGroupId);
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
    notInGroup: PropTypes.bool.isRequired,
    selectedGroupId: PropTypes.string.isRequired,
    selectedRoom: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedRoom = Session.get("selectedRoom");

    return {
        selectedGroupId,
        selectedRoom,
        meteorCall: Meteor.call
    };
})(ChatAreaFooter);
