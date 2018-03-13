import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
//import FlipMove from "react-flip-move";

import { ProfileDB } from "../../../api/profile.js"

export class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    renderProfile() {
        return (this.props.bio=="") ? "Replace me": this.props.bio;
    }

    onChangeBio(event) {
        this.bio = event.target.value.trim();
        //console.log(event.target.value.trim());
    }

    onUpdateBio() {
        //console.log(this.bio);
        Meteor.call("profilesUpdateBio", Meteor.userId(),this.bio, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
        //this.render();
    }

    render() {
        this.currentUserId = Meteor.userId();
        /*this.props.bio = Meteor.call("usersFindBio",this.currentUserId, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });*/
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
    var doc = ProfileDB.find().fetch()[0];
    //console.log(doc.bio);
    return {
        bio: (!doc||!doc.bio) ? "Replace me": doc.bio,
        meteorCall: Meteor.call
    };
})(Profile);