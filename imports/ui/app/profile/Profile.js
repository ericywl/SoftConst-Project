import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";
//import { UsersDB } from "../../../api/users";

export class Profile extends React.Component {
    constructor(props) {
        super(props);
    }
    renderProfile() {
        return this.props.bio;
    }

    onChangeBio(event) {
        this.props.bio = event.target.value.trim();
        //console.log(event.target.value.trim());
    }

    onUpdateBio() {
        console.log(this.bio);
        Meteor.call("usersUpdateBio", this.props.bio, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
        this.render();
    }

    render() {
        this.currentUserId = Meteor.userId;
        this.props.bio = Meteor.call("usersFindBio",this.currentUserId, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
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
    Meteor.subscribe("usersProfile");
    return {
        bio: "Replace me",
        meteorCall: Meteor.call
    };
})(Profile);