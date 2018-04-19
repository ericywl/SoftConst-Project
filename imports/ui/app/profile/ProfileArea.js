// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// APIs
import { ProfilesDB } from "../../../api/profiles.js";

export class ProfileArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.profile) {
            return <div>hi</div>;
        }

        return <div>{this.props.profile.displayName}</div>;
    }
}

export default withTracker(() => {
    const selectedProfileId = Session.get("selectedProfileId");
    let profile;
    if (selectedProfileId === "") {
        profile = ProfilesDB.findOne({ _id: Meteor.userId() });
    } else {
        profile = ProfilesDB.findOne({ _id: selectedProfileId });
    }

    return {
        selectedProfileId,
        profile,
        meteorCall: Meteor.call
    };
})(ProfileArea);
