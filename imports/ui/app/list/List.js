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
    searchChatFilterBeforeSet,
    searchChatFilterBeforeFetch
} from "../../../misc/methods";
import { SHOWN_ITEMS_LIMIT } from "../../../misc/constants";

export class List extends React.Component {
    renderList() {
        if (this.props.selectedTab === "groups") {
            return this.props.groups.map(group => {
                return (
                    <ListItem
                        key={group._id}
                        item={group}
                        selectedTab={this.props.selectedTab}
                    />
                );
            });
        }

        return this.props.dsbjs.map(dsbj => {
            return (
                <ListItem
                    key={dsbj._id}
                    item={dsbj}
                    selectedTab={this.props.selectedTab}
                />
            );
        });
    }

    render() {
        const itemListClass =
            this.props.selectedTab === "groups" ? "" : " item-list--noroombar";

        return (
            <div
                className="page-content__sidebar-wrapper"
                ref={this.setWrapperRef.bind(this)}
            >
                <div className={"item-list" + itemListClass}>
                    <ListHeader selectedTab={this.props.selectedTab} />
                    <FlipMove
                        enterAnimation="none"
                        leaveAnimation="none"
                        duration="100"
                        maintainContainerHeight="true"
                    >
                        {this.renderList()}
                    </FlipMove>
                </div>

                {// Render roombar if groups
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

        document.addEventListener(
            "touchstart",
            this.handleClickOutside.bind(this)
        );
    }

    componentWillUnmount() {
        // Remove listener for click events
        document.removeEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );

        document.removeEventListener(
            "touchstart",
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
            if (this.props.session.get("isNavOpen"))
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
    const searchQuery = Session.get("chatQuery");

    const profilesHandle = Meteor.subscribe("profiles");
    const groupsHandle = Meteor.subscribe("groups");
    const dsbjsHandle = Meteor.subscribe("dsbjs");

    const userProfile = ProfilesDB.findOne({ _id: Meteor.userId() });
    const userGroups = userProfile ? userProfile.groups : [];
    const userDsbjs = userProfile ? userProfile.dsbjs : [];

    const fetchedGroups = fetchItemsFromDB(
        "groups",
        selectedGroupId,
        searchQuery,
        userGroups
    );

    const fetchedDsbjs = fetchItemsFromDB(
        "dsbjs",
        selectedDsbjId,
        searchQuery,
        userDsbjs
    );

    return {
        ready:
            profilesHandle.ready() &&
            groupsHandle.ready() &&
            dsbjsHandle.ready(),
        groups: fetchedGroups,
        dsbjs: fetchedDsbjs,
        notInGroup: !userGroups.includes(selectedGroupId),
        session: Session
    };
})(List);

/* HELPER METHODS */
const fetchItemsFromDB = (item, selectedItemId, query, userItems) => {
    let items = [];
    const filteredQuery = searchChatFilterBeforeFetch(query);
    if (filteredQuery[0] === "#") {
        const regex = new RegExp("^" + filteredQuery.substring(1), "i");
        if (item === "groups") {
            items = GroupsDB.find(
                { "tags.0": { $exists: true }, tags: regex },
                {
                    sort: { lastMessageAt: -1 },
                    $limit: SHOWN_ITEMS_LIMIT
                }
            ).fetch();
        } else {
            items = DsbjsDB.find(
                {
                    "tags.0": { $exists: true },
                    tags: regex,
                    timeoutAt: { $exists: true, $gt: moment().valueOf() }
                },
                {
                    sort: { createdAt: -1 },
                    $limit: SHOWN_ITEMS_LIMIT
                }
            ).fetch();
        }
    } else {
        const regex = new RegExp(filteredQuery, "i");
        if (item === "groups") {
            items = GroupsDB.find(
                { _id: { $in: userItems }, name: regex },
                {
                    sort: { lastMessageAt: -1 }
                }
            ).fetch();
        } else {
            items = DsbjsDB.find(
                {
                    _id: { $in: userItems },
                    name: regex,
                    timeoutAt: { $exists: true, $gt: moment().valueOf() }
                },
                {
                    sort: { lastMessageAt: -1 }
                }
            );
        }
    }

    return items.map(item => {
        return {
            ...item,
            selected: item._id === selectedItemId
        };
    });
};
