// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class ChatAreaFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            error: ""
        };
    }

    render() {
        const disabled =
            this.props.notInGroup ||
            (this.props.selectedRoom && !this.props.isModerator)
                ? true
                : false;
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
                        disabled={disabled}
                        placeholder={placeholder}
                        ref="msgInput"
                        type="text"
                        value={this.state.input}
                        onChange={this.handleInputChange.bind(this)}
                    />
                </form>
            </div>
        );
    }

    // Reset the message input field if user change group
    componentDidUpdate(prevProps, prevState, prevContext) {
        const currentGroupId = this.props.selectedGroupId;
        const prevGroupId = prevProps.selectedGroupId;

        if (currentGroupId && currentGroupId !== prevGroupId) {
            this.setState({
                input: ""
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
                try {
                    this.props.meteorCall(
                        "groupsUpdateLastMessageAt",
                        partialMsg.groupId,
                        moment().valueOf()
                    );
                    Session.set("sentToGroup", this.props.selectedGroupId);
                } catch (err) {
                    // remove message from db
                    throw new Meteor.Error(err.reason);
                }

                this.setState({ input: "" });
            }
        });
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
