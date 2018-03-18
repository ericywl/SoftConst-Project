import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
//import FlipMove from "react-flip-move";

import { ProfilesDB } from "../../../api/profiles.js"
import { ProfileTagsHeader } from "./ProfileTagsHeader.js";
import { ProfileTagsList } from "./ProfileTagsList.js";

export class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    renderProfile() {
        return (this.props.bio=="") ? "Replace me": this.props.bio;
    }

    onChangeBio(event) {
        this.bio = event.target.value.trim();
        console.log(this.bio);
    }

    onUpdateBio() {
        Meteor.call("profilesUpdateBio", Meteor.userId(),this.bio, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
    }

    render() {
        this.currentUserId = Meteor.userId();
        return (
            <div className="profile">
                <div>
                    <h6>
                        {this.renderProfile()}
                    </h6>
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
                        onClick={this.onUpdateBio.bind(this)}>
                        update
                    </button>
                </div>
                <div>
                <ProfileTagsHeader />
                </div>
                <div>
                <ProfileTagsList />
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
    Meteor.subscribe("profiles");
    const doc = ProfilesDB.find().fetch()[0];

    return {
        bio: (!doc||!doc.bio) ? "Bio dummy text" : doc.bio,
        meteorCall: Meteor.call
    };
})(Profile);
