// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ProfileListHeader from "./ProfileListHeader";
import ProfileListItem from "./ProfileListItem";

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
import { Profile } from "./Profile";

export class ProfileList extends React.Component {
    renderList() {
        return this.props.profiles.map(profile => {
            return <ProfileListItem key={profile._id} item={profile} />;
        });
    }

    render() {
        return (
            <div
                className="page-content__sidebar-wrapper"
                ref={this.setWrapperRef.bind(this)}
            >
                <div className="item-list item-list--noroombar">
                    <ProfileListHeader />
                    {this.renderList()}
                </div>
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

ProfileList.propTypes = {
    ready: PropTypes.bool.isRequired,
    profiles: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

function includes(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) return true;
    }
}

function localFilter(items, query) {
    if (query[0] === "#") {
        query = query.slice(1);
        const queryLen = query.length;
        return items.filter(item => {
            for (let i = 0; i < item.tags.length; i++) {
                const tag = item.tags[i].slice(0, queryLen);
                if (tag.toLowerCase() === query) return true;
            }

            return false;
        });
    } else if (query[0] === "@") {
        query = query.slice(1);
        const queryLen = query.length;
        return items.filter(item => {
            return item.displayName.includes(query);
        });
    }
    return [];
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    const selectedDsbjId = Session.get("selectedDsbjId");
    const selectedProfileId = Session.get("selectedProfileId");
    const searchQuery = Session.get("searchQuery");

    const profilesHandle = Meteor.subscribe("profiles");

    const userProfile = ProfilesDB.findOne({ _id: Meteor.userId() });
    const fetchedProfiles = fetchProfilesFromDB(
        selectedProfileId,
        searchQuery,
        userProfile.tags
    );

    return {
        ready: profilesHandle.ready(),
        profiles: localFilter(fetchedProfiles, searchQuery),
        session: Session
    };
})(ProfileList);

/* HELPER METHODS */
const fetchProfilesFromDB = (selectedItemId, query, userTags) => {
    let items = [];
    if (query === "") {
        items = ProfilesDB.find(
            {
                _id: { $ne: Meteor.userId() },
                tags: { $exists: true, $not: { $size: 0 }, $in: userTags }
            },
            { sort: { createdAt: -1 } }
        ).fetch();
    } else if (searchFilterBeforeFetch(query)[0] === "#") {
        items = ProfilesDB.find(
            {
                _id: { $ne: Meteor.userId() },
                tags: { $exists: true, $not: { $size: 0 } }
            },
            { sort: { createdAt: -1 } }
        ).fetch();
    }

    if (query[0] === "#") {
        items = items.map(item => {
            return {
                ...item,
                selected: includes(item.tags, query.slice(1)) // item.tags === selectedItemId
            };
        });
    } else if (query[0] === "@") {
        items = items.map(item => {
            return {
                ...item,
                selected: item.displayName == query.slice(1) // item.tags === selectedItemId
            };
        });
    } else {
        items = items.map(item => {
            return {
                ...item,
                selected: item.tags === selectedItemId
            };
        });
    }

    return items;
};
