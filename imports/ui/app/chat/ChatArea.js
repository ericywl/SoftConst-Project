// Library
import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ChatAreaHeader from "./ChatAreaHeader";
import ChatAreaFooter from "./ChatAreaFooter";
import ChatAreaBody from "./ChatAreaBody";

// APIs
import { GroupsDB } from "../../../api/groups";
import { DsbjsDB } from "../../../api/dsbjs";
import { ProfilesDB } from "../../../api/profiles";

/**
 * Houses the list of messages, chat header and chat footer
 */
export class ChatArea extends React.Component {
    render() {
        const isGroupTab = this.props.selectedTab === "groups";
        const tabText = this.props.selectedTab.slice(
            0,
            this.props.selectedTab.length - 1
        );

        const selectedItem = isGroupTab
            ? this.props.selectedGroup
            : this.props.selectedDsbj;

        const memberProfiles = isGroupTab
            ? this.props.groupMembers
            : this.props.dsbjAttendees;

        const ownerProfile = isGroupTab
            ? this.props.groupOwner
            : this.props.dsbjCreator;

        const notInItem = isGroupTab
            ? this.props.notInGroup
            : this.props.notInDsbj;

        const isOwner = isGroupTab
            ? this.props.isGroupOwner
            : this.props.isDsbjCreator;

        const isModerator = isGroupTab ? this.props.isModerator : false;

        if (!selectedItem) {
            return (
                <div className="chat-area">
                    <p className="empty-chat-area">
                        Please select a {tabText} to start chatting.
                    </p>
                </div>
            );
        }

        return (
            <div className="chat-area">
                <ChatAreaHeader
                    owner={ownerProfile}
                    members={memberProfiles}
                    selectedItem={selectedItem}
                    selectedTab={this.props.selectedTab}
                    notInItem={notInItem}
                    isOwner={isOwner}
                    isModerator={isModerator}
                />

                <ChatAreaBody
                    selectedItem={selectedItem}
                    selectedTab={this.props.selectedTab}
                    notInItem={notInItem}
                    isOwner={isOwner}
                    isModerator={isModerator}
                />

                <ChatAreaFooter
                    selectedItemId={selectedItem._id}
                    selectedTab={this.props.selectedTab}
                    notInItem={notInItem}
                    isOwner={isOwner}
                    isModerator={isModerator}
                />
            </div>
        );
    }
}

ChatArea.propTypes = {
    isModerator: PropTypes.bool.isRequired,
    isGroupOwner: PropTypes.bool.isRequired,
    isDsbjCreator: PropTypes.bool.isRequired,
    selectedGroup: PropTypes.object,
    selectedDsbj: PropTypes.object,
    groupMembers: PropTypes.array.isRequired,
    dsbjAttendees: PropTypes.array.isRequired,
    selectedTab: PropTypes.string.isRequired,
    notInGroup: PropTypes.bool.isRequired,
    notInDsbj: PropTypes.bool.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedDsbjId = Session.get("selectedDsbjId");

    // const profilesHandle = Meteor.subscribe("profiles");
    // const groupsHandle = Meteor.subscribe("groups");
    // const dsbjsHandle = Meteor.subscribe("dsbjs");

    const userProfile = ProfilesDB.findOne({ _id: Meteor.userId() });
    const userGroups = userProfile ? userProfile.groups : [];
    const userDsbjs = userProfile ? userProfile.dsbjs : [];

    const selectedGroup = GroupsDB.findOne({ _id: selectedGroupId });
    const groupOwner = selectedGroup
        ? ProfilesDB.findOne({ _id: selectedGroup.ownedBy })
        : {};
    const groupMembers = selectedGroup
        ? ProfilesDB.find({
              _id: { $in: selectedGroup.members }
          }).fetch()
        : [];

    const selectedDsbj = DsbjsDB.findOne({ _id: selectedDsbjId });
    const dsbjCreator = selectedDsbj
        ? ProfilesDB.findOne({ _id: selectedDsbj.createdBy })
        : {};
    const dsbjAttendees = selectedDsbj
        ? ProfilesDB.find({ _id: { $in: selectedDsbj.attendees } }).fetch()
        : [];

    const isDsbjCreator = selectedDsbj
        ? selectedDsbj.createdBy === Meteor.userId()
        : false;

    const isGroupOwner = selectedGroup
        ? selectedGroup.ownedBy === Meteor.userId()
        : false;

    const isModerator = selectedGroup
        ? selectedGroup.moderators.includes(Meteor.userId())
        : false;

    return {
        isDsbjCreator,
        isGroupOwner,
        isModerator,
        selectedGroup,
        selectedDsbj,
        groupMembers,
        dsbjAttendees,
        groupOwner,
        dsbjCreator,
        notInGroup: !userGroups.includes(selectedGroupId),
        notInDsbj: !userDsbjs.includes(selectedDsbjId)
        // ready:
        //     profilesHandle.ready() &&
        //     groupsHandle.ready() &&
        //     dsbjsHandle.ready()
    };
})(ChatArea);
