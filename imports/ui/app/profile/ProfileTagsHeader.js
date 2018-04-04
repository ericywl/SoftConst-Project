import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import { ProfilesDB } from "../../../api/profiles.js";

export class ProfileTagsHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newTag: ""
        };
    }

    onChangeTag(event) {
        event.preventDefault();
        const input = event.target.value;
        this.setState({ newTag: input });
    }

    onAddTag(event) {
        event.preventDefault();
        // Meteor.call("profilesAddTag", this.state.newTag.trim(), (err, res) => {
        //     err ? console.log({ error: err.reason }) : null;
        // });
        console.log(this.newTag);
        this.state.newTag = "";
    }

    render() {
        //this.currentUserId = Meteor.userId();
        return (
            <div>
                <form
                    className="boxed-view__form--row"
                    onSubmit={this.onAddTag.bind(this)}
                >
                    <input
                        className="tags__input"
                        ref="new-tag"
                        type="text"
                        placeholder="New Tag"
                        value={this.state.newTag}
                        onChange={this.onChangeTag.bind(this)}
                    />
                    <button
                        className="button button--tag"
                        name="add-tag"
                        onClick={this.onAddTag.bind(this)}
                    >
                        add
                    </button>
                </form>
            </div>
        );
    }
}

ProfileTagsHeader.propTypes = {};

export default withTracker(() => {
    return {
        //meteorCall: Meteor.call
    };
})(ProfileTagsHeader);
