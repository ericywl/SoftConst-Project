import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { ProfilesDB } from "../../../api/profiles.js"

export class ProfileTagsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleTagDelete(event) {
        event.preventDefault();
        const tagName = event.target.parentElement.children[1].innerHTML;

        this.props.meteorCall(
            "profilesRemoveTag",
            Meteor.userId(),
            tagName
        );
    }

    renderTags() {
        return (!this.props.tags) ? ["dummy text"] : this.props.tags.map((tag, index) => (
            /*<span
                style={{ float: "left", padding: "0 0.5rem" }}
                key={`tag${index}`}
            >
                #{tag}
            </span>*/
            <span className="tags__tag" key={`tag${index}`}>
                <span className="tags__tag--hash"># </span>
                <span>{tag}</span>
                {this.props.isModerator ? (
                    <img
                        className="tags__tag--cross"
                        src="/images/round_x.svg"
                        onClick={this.handleTagDelete.bind(this)}
                    />
                ) : (
                    undefined
                )}
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
    //tags: PropTypes.arrayOf(String).isRequired,
};

export default withTracker(() => {
    //Meteor.subscribe("profiles");
    //console.log("test");
    //const doc = ProfilesDB.find({_id:Meteor.userId()}).fetch()[0];
    //console.log(doc);
    return {
        //tags: (doc && doc.tags) ? doc.tags : ["Tags dummy text"],
    };
})(ProfileTagsList);
