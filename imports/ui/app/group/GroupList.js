// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

// React Components
import GroupListHeader from "./GroupListHeader";
import GroupListItem from "./GroupListItem";
import GroupListSidebar from "./_RoomBar";

// APIs
import { GroupsDB } from "../../../api/groups";
import { DsbjsDB } from "../../../api/dsbjs";
import { ProfilesDB } from "../../../api/profiles";
import {
    searchFilterBeforeSet,
    searchFilterBeforeFetch,
    filterItemsByQuery
} from "../../../misc/methods";
import { join } from "path";

const SHOWN_GROUPS_LIMIT = 20;
export class GroupList extends React.Component {
    renderGroupList() {
        return this.props.groups.map(group => {
            return <GroupListItem key={group._id} group={group} />;
        });
    }

    render() {
        const itemListClass =
            this.props.selectedTab === "groups" ? "" : " item-list--dsbj";

        return (
            <div
                className="page-content__sidebar-wrapper"
                ref={this.setWrapperRef.bind(this)}
            >
                <div className={"item-list" + itemListClass}>
                    <GroupListHeader selectedTab={this.props.selectedTab} />
                    <FlipMove maintainContainerHeight="true">
                        {this.renderGroupList()}
                    </FlipMove>
                </div>

                {this.props.selectedTab === "groups" ? (
                    <GroupListSidebar notInGroup={this.props.notInGroup} />
                ) : (
                    undefined
                )}
            </div>
        );
    }

    componentDidMount() {
        // Add listener for click events
        document.addEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );
    }

    componentWillUnmount() {
        // Remove listener for click events
        document.removeEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        const inWrapperRef =
            this.wrapperRef && !this.wrapperRef.contains(event.target);

        if (
            inWrapperRef &&
            !this.props.session.get("isAddModalOpen") &&
            event.target.className !== "header__nav-toggle"
        ) {
            this.props.session.set("isNavOpen", false);
        }
    }
}

GroupList.propTypes = {
    groups: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedDsbjId = Session.get("selectedDsbjId");
    const searchQuery = Session.get("searchQuery");

    const profilesHandle = Meteor.subscribe("profiles");
    const groupsHandle = Meteor.subscribe("groups");

    const userProfile = ProfilesDB.find().fetch()[0];
    const userGroups = userProfile ? userProfile.groups : [];

    const fetchedGroups = fetchGroupsFromDB(selectedGroupId, searchQuery);
    const queriedGroups = filterItemsByQuery(fetchedGroups, searchQuery);
    return {
        ready: profilesHandle.ready() && groupsHandle.ready(),
        groups: queriedGroups,
        notInGroup: !userGroups.includes(selectedGroupId),
        session: Session
    };
})(GroupList);

/* HELPER METHODS */
const fetchGroupsFromDB = (selectedGroupId, query) => {
    let groups = [];
    const userProfile = ProfilesDB.find().fetch()[0];
    const userGroups = userProfile ? userProfile.groups : [];
    if (searchFilterBeforeFetch(query)[0] === "#") {
        groups = GroupsDB.find(
            { isPrivate: false },
            {
                sort: {},
                $limit: SHOWN_GROUPS_LIMIT
            }
        ).fetch();
    } else {
        groups = GroupsDB.find(
            { _id: { $in: userGroups } },
            {
                sort: { lastMessageAt: -1 },
                $limit: SHOWN_GROUPS_LIMIT
            }
        ).fetch();
    }

    groups = groups.map(group => {
        return {
            ...group,
            selected: group._id === selectedGroupId
        };
    });

    return groups;
};
