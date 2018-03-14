import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

import { GroupsDB } from "../../../api/groups";
import { ProfilesDB } from "../../../api/profiles";
import { searchFilter } from "../../../methods/methods";
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

const groupsFilter = (groups, query) => {
    query = query.replace(/\s/gi, "").toLowerCase();
    if (!groups) throw new Meteor.Error("filter-groups-not-provided");
    if (!query) return groups;

    if (query[0] === "#") {
        const queryLen = query.length - 1;
        return groups.filter(group => {
            for (let i = 0; i < group.tags.length; i++) {
                const tag = group.tags[i].slice(0, queryLen);
                if (tag.toLowerCase() === query.slice(1)) return true;
            }

            return false;
        });
    }

    return groups.filter(
        group => searchFilter(group.name).indexOf(query) !== -1
    );
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const searchQuery = Session.get("searchQuery");
    Meteor.subscribe("profiles");
    Meteor.subscribe("groups");

    const userProfile = ProfilesDB.find().fetch()[0];
    const userGroups = userProfile ? userProfile.groups : [];
    const groups = GroupsDB.find(
        { _id: { $in: userGroups } },
        { sort: { lastMessageAt: -1 } }
    )
        .fetch()
        .map(group => {
            return {
                ...group,
                selected: group._id === selectedGroupId
            };
        });

    const queriedGroups = groupsFilter(groups, searchQuery);
    return {
        groups: queriedGroups,
        session: Session
    };
})(GroupList);
