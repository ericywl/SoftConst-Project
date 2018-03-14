// Library
import React from "react";
import PropTypes from "prop-types";
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
        return (
            <div>
                <form onSubmit={this.handleSubmitMessage.bind(this)}>
                    <input
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
            content: this.state.input.trim()
        };

        this.props.meteorCall("messagesInsert", partialMsg, (err, res) => {
            if (err) this.setState({ error: err.reason });

            if (res) {
                try {
                    this.props.call(
                        "groupsUpdateLastMessageAt",
                        partialMsg.groupId,
                        now
                    );
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
    selectedGroupId: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");

    return {
        selectedGroupId,
        meteorCall: Meteor.call
    };
})(ChatAreaFooter);
