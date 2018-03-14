// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

// React Components
import GroupListHeader from "./GroupListHeader";
import GroupListItem from "./GroupListItem";

// APIs
import { PublicGroupsDB, CurrGroupsDB } from "../../../api/groups";
import { CurrProfileDB } from "../../../api/profiles";
import {
    searchFilterBeforeSet,
    searchFilterBeforeFetch
} from "../../../methods/methods";

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
    const searchQuery = Session.get("searchQuery");
    Meteor.subscribe("publicGroups");
    Meteor.subscribe("currentGroups");
    Meteor.subscribe("currentProfile");

    const groups = fetchGroupsFromDB(selectedGroupId, searchQuery);
    const queriedGroups = filterGroupsByQuery(groups, searchQuery);
    return {
        groups: queriedGroups,
        session: Session
    };
})(GroupList);

const filterGroupsByQuery = (groups, query) => {
    if (!groups) throw new Meteor.Error("filter-groups-not-provided");
    if (!query) return groups;

    query = searchFilterBeforeFetch(query);
    if (query[0] === "#") {
        query = query.slice(1);
        const queryLen = query.length;
        return groups.filter(group => {
            for (let i = 0; i < group.tags.length; i++) {
                const tag = group.tags[i].slice(0, queryLen);
                if (tag.toLowerCase() === query) return true;
            }

            return false;
        });
    }

    return groups.filter(
        group => searchFilterBeforeFetch(group.name).indexOf(query) !== -1
    );
};

const fetchGroupsFromDB = (selectedGroupId, query) => {
    let groups = [];
    if (searchFilterBeforeFetch(query)[0] === "#") {
        groups = PublicGroupsDB.find().fetch();
    } else {
        groups = CurrGroupsDB.find().fetch();
    }

    groups = groups.map(group => {
        return {
            ...group,
            selected: group._id === selectedGroupId
        };
    });

    return groups;
};
