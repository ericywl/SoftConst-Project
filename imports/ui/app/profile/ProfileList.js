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
    searchProfileFilterBeforeSet,
    searchProfileFilterBeforeFetch
} from "../../../misc/methods";
import { SHOWN_ITEMS_LIMIT } from "../../../misc/constants";

export class ProfileList extends React.Component {
    renderList() {
        return this.props.profiles.map(profile => {
            return <ProfileListItem key={profile._id} profile={profile} />;
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
            if (this.props.session.get("isNavOpen"))
                this.props.session.set("isNavOpen", false);
        }
    }
}

ProfileList.propTypes = {
    ready: PropTypes.bool.isRequired,
    profiles: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedProfileId = Session.get("selectedProfileId");
    const searchQuery = Session.get("profileQuery");

    const profilesHandle = Meteor.subscribe("profiles");
    const userProfile = ProfilesDB.findOne({ _id: Meteor.userId() });
    const fetchedProfiles = fetchProfilesFromDB(
        selectedProfileId,
        searchQuery,
        userProfile ? userProfile.tags : []
    );

    return {
        ready: profilesHandle.ready(),
        profiles: fetchedProfiles,
        session: Session
    };
})(ProfileList);

/* HELPER METHODS */
const fetchProfilesFromDB = (selectedProfileId, query, userTags) => {
    let profiles = [];
    const filteredQuery = searchProfileFilterBeforeFetch(query);
    const regex = new RegExp("^" + filteredQuery.substring(1), "i");
    if (filteredQuery[0] === "#") {
        profiles = ProfilesDB.find(
            {
                _id: { $ne: Meteor.userId() },
                tags: regex
            },
            { sort: { createdAt: -1 } }
        ).fetch();
    } else if (filteredQuery[0] === "@") {
        if (filteredQuery.length === 1) {
            profiles = ProfilesDB.find(
                { _id: { $ne: Meteor.userId() } },
                { sort: { displayName: 1 } }
            ).fetch();
        } else {
            profiles = ProfilesDB.find(
                {
                    _id: { $ne: Meteor.userId() },
                    displayName: regex
                },
                { sort: { createdAt: -1 } }
            ).fetch();
        }
    } else {
        profiles = ProfilesDB.find(
            {
                _id: { $ne: Meteor.userId() },
                tags: { $exists: true, $not: { $size: 0 }, $in: userTags }
            },
            { sort: { createdAt: -1 } }
        ).fetch();
    }

    return profiles.map(profile => {
        return {
            ...profile,
            selected: profile._id === selectedProfileId
        };
    });
};
