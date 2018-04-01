// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import MessageList from "./MessageList";

export class ChatAreaBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    }

    render() {
        return (
            <div className="chat-area__body">
                {this.state.error ? <p>{this.state.error}</p> : undefined}

                {this.props.notInGroup ? (
                    <button onClick={this.onClickJoin.bind(this)}>Join</button>
                ) : (
                    <MessageList />
                )}
            </div>
        );
    }

    onClickJoin(event) {
        event.preventDefault();
        this.props.meteorCall(
            "profilesJoinGroup",
            this.props.selectedGroupId,
            (err, res) => {
                if (err) this.setState({ error: err.reason });
                if (res) {
                    // TODO: Add joined list message
                    console.log("you have joined the list!");
                }
            }
        );
    }
}

ChatAreaBody.propTypes = {
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    return { meteorCall: Meteor.call };
})(ChatAreaBody);
