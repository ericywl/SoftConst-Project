// Library
import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import MessageList from "./MessageList";
import ChatAreaHeader from "./ChatAreaHeader";
import ChatAreaFooter from "./ChatAreaFooter";

// APIs
import { GroupsDB } from "../../../api/groups";
import { ProfilesDB } from "../../../api/profiles";

/**
 * Houses the list of messages, chat header and chat footer
 */
export class ChatArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    }

    onClickJoin(event) {
        event.preventDefault();
        this.props.meteorCall(
            "profilesJoinGroup",
            this.props.selectedGroup._id,
            (err, res) => {
                if (err) this.setState({ error: err.reason });
                if (res) console.log("you have joined the group!");
            }
        );
    }

    render() {
        if (!this.props.selectedGroup) {
            return (
                <div>
                    <p>Please select a group to start chatting.</p>
                </div>
            );
        }

        return (
            <div className="chat-area">
                <ChatAreaHeader
                    selectedGroup={this.props.selectedGroup}
                    isModerator={this.props.isModerator}
                />

                {this.state.error ? <p>{this.state.error}</p> : undefined}

                {this.props.notInGroup ? (
                    <div>
                        <button onClick={this.onClickJoin.bind(this)}>
                            Join
                        </button>
                    </div>
                ) : (
                    <FlipMove maintainContainerHeight={true}>
                        <MessageList />
                    </FlipMove>
                )}

                <ChatAreaFooter notInGroup={this.props.notInGroup} />
            </div>
        );
    }
}

ChatArea.propTypes = {
    isModerator: PropTypes.bool.isRequired,
    selectedGroup: PropTypes.object,
    meteorCall: PropTypes.func.isRequired,
    notInGroup: PropTypes.bool.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groups");
    Meteor.subscribe("profiles");

    const userProfile = ProfilesDB.find().fetch()[0];
    const userGroups = userProfile ? userProfile.groups : [];

    const selectedGroup = GroupsDB.findOne({ _id: selectedGroupId });
    const isModerator = selectedGroup
        ? selectedGroup.moderators.includes(Meteor.userId())
        : false;

    return {
        isModerator,
        selectedGroup,
        meteorCall: Meteor.call,
        notInGroup: !userGroups.includes(selectedGroupId)
    };
})(ChatArea);
