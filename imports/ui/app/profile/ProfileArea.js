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
<<<<<<< HEAD
        if (Meteor.userId()) {
            return (
                <div>
                    <Profile/>
                </div>
            );
        }
=======
        return (
            <div>
                <Profile />
            </div>
        );
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
    }
}

export default ProfileArea;
<<<<<<< HEAD


=======
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
