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

                {this.props.notInItem ? (
                    <button onClick={this.onClickJoin.bind(this)}>Join</button>
                ) : (
                    <MessageList />
                )}
            </div>
        );
    }

    onClickJoin(event) {
        event.preventDefault();
        const joinMethod =
            this.props.selectedTab === "groups"
                ? "profilesJoinGroup"
                : "profilesJoinDsbj";

        this.props.meteorCall(
            joinMethod,
            this.props.selectedItemId,
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
    selectedItemId: PropTypes.string.isRequired,
    selectedTab: PropTypes.string.isRequired,
    notInItem: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isModerator: PropTypes.bool.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    return { meteorCall: Meteor.call };
})(ChatAreaBody);
