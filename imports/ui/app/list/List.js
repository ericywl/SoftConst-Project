// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import ListRoombar from "./_RoomBar";

// APIs
import { GroupsDB } from "../../../api/groups";
import { DsbjsDB } from "../../../api/dsbjs";
import { ProfilesDB } from "../../../api/profiles";
import {
    searchFilterBeforeSet,
    searchFilterBeforeFetch,
    filterItemsByQuery
} from "../../../misc/methods";
import { SHOWN_ITEMS_LIMIT } from "../../../misc/constants";

export class List extends React.Component {
    renderList() {
        return this.props.groups.map(group => {
            return <ListItem key={group._id} group={group} />;
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
                    <ListHeader selectedTab={this.props.selectedTab} />
                    <FlipMove maintainContainerHeight="true">
                        {this.renderList()}
                    </FlipMove>
                </div>

                {// Render roombar
                this.props.selectedTab === "groups" ? (
                    <ListRoombar notInGroup={this.props.notInGroup} />
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
        // Close nav if click outside is detected
        const inWrapperRef =
            this.wrapperRef && !this.wrapperRef.contains(event.target);

        if (
            inWrapperRef &&
            !this.props.session.get("isModalOpen") &&
            event.target.className !== "header__nav-toggle"
        ) {
            this.props.session.set("isNavOpen", false);
        }
    }
}

List.propTypes = {
    groups: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedDsbjId = Session.get("selectedDsbjId");
    const searchQuery = Session.get("searchQuery");

    const profilesHandle = Meteor.subscribe("profiles");
    const groupsHandle = Meteor.subscribe("groups");

    const userProfile = ProfilesDB.findOne({ _id: Meteor.userId() });
    const userGroups = userProfile ? userProfile.groups : [];

    const fetchedGroups = fetchGroupsFromDB(selectedGroupId, searchQuery);
    const queriedGroups = filterItemsByQuery(fetchedGroups, searchQuery);
    return {
        ready: profilesHandle.ready() && groupsHandle.ready(),
        groups: queriedGroups,
        notInGroup: !userGroups.includes(selectedGroupId),
        session: Session
    };
})(List);

/* HELPER METHODS */
const fetchGroupsFromDB = (selectedGroupId, query) => {
    const userProfile = ProfilesDB.findOne({ _id: Meteor.userId() });
    if (!userProfile) return [];

    let groups = [];
    const userGroups = userProfile.groups;
    if (searchFilterBeforeFetch(query)[0] === "#") {
        groups = GroupsDB.find(
            { tags: { $exists: true, $not: { $size: 0 } } },
            {
                sort: { lastMessageAt: -1 },
                $limit: SHOWN_ITEMS_LIMIT
            }
        ).fetch();
    } else {
        groups = GroupsDB.find(
            { _id: { $in: userGroups } },
            {
                sort: { lastMessageAt: -1 },
                $limit: SHOWN_ITEMS_LIMIT
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

const fetchDsbjsFromDB = (selectedDsbjId, query) => {
    const userProfile = ProfilesDB.find({ _id: Meteor.userId() });
    if (!userProfile) return [];

    let dsbjs = [];
    const userDsbjs = userProfile.dsbjs;
    if (searchFilterBeforeFetch(query)[0] === "#") {
        dsbjs = DsbjsDB.find(
            {
                tags: { $exists: true, $not: { $size: 0 } },
                timeoutAt: { $exists: true, $gt: moment().valueOf() }
            },
            {
                sort: { createdAt: -1 },
                $limit: SHOWN_ITEMS_LIMIT
            }
        ).fetch();
    } else {
        dsbjs = DsbjsDB.find(
            { _id: { $in: userDsbjs } },
            {
                sort: { lastMessageAt: -1 },
                $limit: SHOWN_ITEMS_LIMIT
            }
        ).fetch();
    }

    dsbjs = dsbjs.map(dsbj => {
        return {
            ...dsbj,
            selected: dsbj._id === selectedDsbjId
        };
    });

    return dsbjs;
};
