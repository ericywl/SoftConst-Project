import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

<<<<<<< HEAD
import { ProfilesDB } from "../../../api/profiles.js"
=======
import { ProfilesDB } from "../../../api/profiles.js";
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2

export class ProfileTagsHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
<<<<<<< HEAD
            newTag: "",
=======
            newTag: ""
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
        };
    }

    onChangeTag(event) {
        event.preventDefault();
        const input = event.target.value;
<<<<<<< HEAD
        this.setState({newTag: input});
=======
        this.setState({ newTag: input });
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
    }

    onAddTag(event) {
        event.preventDefault();
        Meteor.call("profilesAddTag", this.state.newTag.trim(), (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
<<<<<<< HEAD
        console.log(this.newTag)
=======
        console.log(this.newTag);
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
        this.state.newTag = "";
    }

    render() {
        //this.currentUserId = Meteor.userId();
        return (
<<<<<<< HEAD
            <div >
                <form class="boxed-view__form--row" onSubmit={this.onAddTag.bind(this)}>
                    <input
                        class="tags__input"
=======
            <div>
                <form
                    className="boxed-view__form--row"
                    onSubmit={this.onAddTag.bind(this)}
                >
                    <input
                        className="tags__input"
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
                        ref="new-tag"
                        type="text"
                        placeholder="New Tag"
                        value={this.state.newTag}
                        onChange={this.onChangeTag.bind(this)}
                    />
<<<<<<< HEAD
                    <button 
                        class="button button--tag"
                        name="add-tag"
                        onClick={this.onAddTag.bind(this)}>
=======
                    <button
                        className="button button--tag"
                        name="add-tag"
                        onClick={this.onAddTag.bind(this)}
                    >
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
                        add
                    </button>
                </form>
            </div>
        );
    }
}

<<<<<<< HEAD
ProfileTagsHeader.propTypes = {
};
=======
ProfileTagsHeader.propTypes = {};
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2

export default withTracker(() => {
    return {
        //meteorCall: Meteor.call
    };
<<<<<<< HEAD
})(ProfileTagsHeader);
=======
})(ProfileTagsHeader);
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
