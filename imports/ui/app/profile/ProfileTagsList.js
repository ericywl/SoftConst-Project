import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { ProfilesDB } from "../../../api/profiles.js";

export class ProfileTagsList extends React.Component {
    constructor(props) {
        super(props);
    }
    renderProfile() {
        return this.props.bio == "" ? "Replace me" : this.props.bio;
    }

    onChangeBio(event) {
        this.bio = event.target.value.trim();
    }

    onUpdateBio() {
        Meteor.call(
            "profilesUpdateBio",
            Meteor.userId(),
            this.bio,
            (err, res) => {
                err ? console.log({ error: err.reason }) : null;
            }
        );
    }

    render() {
        this.currentUserId = Meteor.userId();
        return (
            <div className="profiles">
                <div>
                    <h6>{this.renderProfile()}</h6>
                </div>
                <div>
                    <input
                        ref="bio"
                        type="text"
                        placeholder="New Bio"
                        onChange={this.onChangeBio.bind(this)}
                    />
                    <button
                        name="update-bio"
                        onClick={this.onUpdateBio.bind(this)}
                    >
                        update
                    </button>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    bio: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    Meteor.subscribe("profiles", Meteor.userId());
    const doc = ProfilesDB.find().fetch()[0];

    return {
        bio: !doc || !doc.bio ? "Replace me" : doc.bio,
        meteorCall: Meteor.call
    };
})(Profile);
