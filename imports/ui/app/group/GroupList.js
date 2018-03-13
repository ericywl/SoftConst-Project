import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

import { GroupsDB } from "../../../api/groups";
import GroupListHeader from "./GroupListHeader";
import GroupListItem from "./GroupListItem";

export class GroupList extends React.Component {
    renderGroupList() {
        return this.props.groups.map(group => {
            return <GroupListItem key={group._id} group={group} />;
        });
    }

    render() {
        return (
            <div className="item-list">
                <GroupListHeader />
                <FlipMove maintainContainerHeight="true">
                    {this.renderGroupList()}
                </FlipMove>
            </div>
        );
    }
}

GroupList.propTypes = {
    groups: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groups");

    const groups = GroupsDB.find()
        .fetch()
        .map(group => {
            return {
                ...group,
                selected: group._id === selectedGroupId
            };
        });

    return {
        groups,
        session: Session
    };
})(GroupList);
