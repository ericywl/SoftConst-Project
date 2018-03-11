import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class ChatAreaFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ""
        };
    }

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

        const input = this.refs.msgInput.value.trim();
        const partialMsg = {
            groupId: this.props.selectedGroupId,
            content: this.state.input
        };

        this.props.meteorCall("messagesInsert", partialMsg, (err, res) => {
            if (err) {
                // show user error
            }

            if (res) {
                this.setState({ input: "" });
            }
        });
    }

    handleInputChange(event) {
        const input = event.target.value;
        this.setState({ input });
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
}

ChatAreaFooter.propTypes = {
    selectedGroupId: PropTypes.string,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    return {
        meteorCall: Meteor.call
    };
})(ChatAreaFooter);
