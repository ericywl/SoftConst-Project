import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { ProfilesDB } from "../../../api/profiles.js"

export class ProfileTagsHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    /*renderProfile() {
        return (this.props.bio=="") ? "Replace me": this.props.bio;
    }*/

    onChangeTag(event) {
        this.newTag = event.target.value.trim();
    }

    onAddTag() {
        Meteor.call("profilesAddTag", Meteor.userId(),this.newTag, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
        console.log(this.newTag)
    }

    render() {
        this.currentUserId = Meteor.userId();
        return (
            <div className="boxed-view__form">
                <form className="">
                    <input
                        ref="new-tag"
                        type="text"
                        placeholder="New Tag"
                        onChange={this.onChangeTag.bind(this)}
                    />
                    <button 
                        className="button button--tag"
                        name="add-tag"
                        onClick={this.onAddTag.bind(this)}>
                        add
                    </button>
                </form>
            </div>
        );
    }
}

ProfileTagsHeader.propTypes = {
    //meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    //Meteor.subscribe("profiles", Meteor.userId());
    return {
        //meteorCall: Meteor.call
    };
})(ProfileTagsHeader);