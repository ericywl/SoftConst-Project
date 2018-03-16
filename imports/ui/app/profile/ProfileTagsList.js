import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { ProfilesDB } from "../../../api/profiles.js"

export class ProfileTagsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderTags() {
        return (!this.props.tags) ? ["dummy text"] : this.props.tags.map((tag, index) => (
            <span
                style={{ float: "left", padding: "0 0.5rem" }}
                key={`tag${index}`}
            >
                #{tag}
            </span>
        ));
    }

    render() {
        return (
            <div className="tags">
                {this.renderTags()}
            </div>
        );
    }
}

ProfileTagsList.propTypes = {
    tags: PropTypes.arrayOf(String).isRequired,
    //meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    Meteor.subscribe("profiles", Meteor.userId());
    var doc = ProfilesDB.find().fetch()[0];
    console.log(doc);
    return {
        tags: (doc && doc.tags) ? doc.tags : ["Tags dummy text"],
        //meteorCall: Meteor.call
    };
})(ProfileTagsList);
