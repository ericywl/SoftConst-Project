// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

// React Components
import DsbjListHeader from "./DsbjListHeader";
import DsbjListItem from "./DsbjListItem";

// APIs
import { DsbjsDB } from "../../../api/dsbjs";
import { ProfilesDB } from "../../../api/profiles";
import {
    searchFilterBeforeSet,
    searchFilterBeforeFetch,
    filterItemsByQuery
} from "../../../misc/misc";

const SHOWN_GROUPS_LIMIT = 10;
export class DsbjList extends React.Component {
    renderDsbjList() {
        return this.props.dsbjs.map(dsbj => {
            return <DsbjListItem key={dsbj._id} group={dsbj} />;
        });
    }

    render() {
        return (
            <div className="item-list">
                <DsbjListHeader />
                <FlipMove maintainContainerHeight="true">
                    {this.renderDsbjList()}
                </FlipMove>
            </div>
        );
    }
}

DsbjList.propTypes = {
    dsbjs: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedDsbjId = Session.get("selectedDsbjId");
    const searchQuery = Session.get("searchQuery");
    Meteor.subscribe("profiles");
    Meteor.subscribe("dsbjs");

    const dsbjs = fetchDsbjsFromDB(selectedDsbjId, searchQuery);
    const queriedDsbjs = filterItemsByQuery(dsbjs, searchQuery);
    return {
        dsbjs: queriedDsbjs,
        session: Session
    };
})(DsbjList);

const fetchDsbjsFromDB = (selectedDsbjId, query) => {
    let dsbjs = [];
    const userProfile = ProfilesDB.find().fetch()[0];
    const userDsbjs = userProfile ? userProfile.groups : [];
    if (searchFilterBeforeFetch(query)[0] === "#") {
        dsbjs = DsbjsDB.find(
            { isPrivate: false },
            {
                sort: {},
                $limit: SHOWN_GROUPS_LIMIT
            }
        ).fetch();
    } else {
        dsbjs = DsbjsDB.find(
            { _id: { $in: userDsbjs } },
            {
                sort: { lastMessageAt: -1 },
                $limit: SHOWN_GROUPS_LIMIT
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
