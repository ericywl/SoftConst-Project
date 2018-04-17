// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// Imports
import Profile from "./Profile";

export class ProfileArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Profile />
            </div>
        );
    }
}

export default ProfileArea;
