import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
//import FlipMove from "react-flip-move";

<<<<<<< HEAD
import { ProfilesDB } from "../../../api/profiles.js"
import { ProfileTagsHeader } from "./ProfileTagsHeader.js";

const profile_padding = {
    padding : '10px 0px'
  };
=======
import { ProfilesDB } from "../../../api/profiles.js";
import { ProfileTagsHeader } from "./ProfileTagsHeader.js";

const profile_padding = {
    padding: "10px 0px"
};
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newBio: ""
<<<<<<< HEAD
        }
=======
        };
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
    }
    renderProfile() {
        return (this.props.bio=="") ? "Replace me": this.props.bio;
    }

    onChangeBio(event) {
        event.preventDefault();
        const newBio = event.target.value;
<<<<<<< HEAD
        this.setState({newBio: newBio});
        //console.log(this.bio);
    }

    onUpdateBio(event) {
        event.preventDefault();
        Meteor.call("profilesUpdateBio", Meteor.userId(),this.state.newBio, (err, res) => {
            err ? console.log({ error: err.reason }) : null;
        });
    }

    handleTagDelete(event) {
        event.preventDefault();
        const tagName = event.target.parentElement.children[1].innerHTML;

        this.props.meteorCall(
            "profilesRemoveTag",
            tagName
        );
    }

    renderTags() {
        return (!this.props.tags) ? ["dummy text"] : this.props.tags.map((tag, index) => (
            <span className="tags__tag" key={`tag${index}`}>
                <span className="tags__tag--hash"># </span>
                    <span>{tag}</span>
                {this.props.tags ? (
                    <img
                        className="tags__tag--cross"
                        src="/images/round_x.svg"
                        onClick={this.handleTagDelete.bind(this)}
                    />
                ) : (
                    console.log("Could not generate tags")//undefined
                )}
            </span>
        ));
=======
        this.setState({ newBio: newBio });
    }

    onUpdateBio(event) {
        event.preventDefault();
        Meteor.call(
            "profilesUpdateBio",
            Meteor.userId(),
            this.state.newBio,
            (err, res) => {
                err ? console.log({ error: err.reason }) : null;
            }
        );
    }

    handleTagDelete(event) {
        event.preventDefault();
        const tagName = event.target.parentElement.children[1].innerHTML;

        this.props.meteorCall("profilesRemoveTag", tagName);
    }

    renderTags() {
        return !this.props.tags
            ? ["dummy text"]
            : this.props.tags.map((tag, index) => (
                  <span className="tags__tag" key={`tag${index}`}>
                      <span className="tags__tag--hash"># </span>
                      <span>{tag}</span>
                      {this.props.tags ? (
                          <img
                              className="tags__tag--cross"
                              src="/images/round_x.svg"
                              onClick={this.handleTagDelete.bind(this)}
                          />
                      ) : (
                          console.log("Could not generate tags") //undefined
                      )}
                  </span>
              ));
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
    }

    renderBio() {
        return (
<<<<<<< HEAD
            <div >
                <form class="boxed-view__form--row" onSubmit={this.onUpdateBio.bind(this)}>
                    <input
                        class="tags__input"
                        ref="new-bio"
                        type="text"
                        placeholder="New Bio"
                        value ={this.state.newBio}
                        onChange={this.onChangeBio.bind(this)}
                    />
                    <button 
                        class="button button--tag"
=======
            <div>
                <form
                    className="boxed-view__form--row"
                    onSubmit={this.onUpdateBio.bind(this)}
                >
                    <input
                        className="tags__input"
                        ref="new-bio"
                        type="text"
                        placeholder="New Bio"
                        value={this.state.newBio}
                        onChange={this.onChangeBio.bind(this)}
                    />
                    <button
                        className="button button--tag"
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
                        name="update-bio"
                        onClick={this.onUpdateBio.bind(this)}>
                        update
                    </button>
                </form>
            </div>
        );
    }

    renderWelcome() {
<<<<<<< HEAD
        return (
            <div>
                Hello, {this.props.displayName}
            </div>
        );
=======
        return <div>Hello, {this.props.displayName}</div>;
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
    }

    render() {
        //this.currentUserId = Meteor.userId();
        return (
            <div className="profile">
                {this.renderWelcome()}
                {this.renderProfile()}
<<<<<<< HEAD
                <div>
                    {this.renderBio()}
                </div>
                <div style={profile_padding}>
                </div>
                <div>
                    <ProfileTagsHeader />
                </div>
                <div>
                    {this.renderTags()}
=======
                <div>{this.renderBio()}</div>
                <div style={profile_padding} />
                <div>
                    <ProfileTagsHeader />
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
                </div>
                <div>{this.renderTags()}</div>
            </div>
        );
    }
}

Profile.propTypes = {
    bio: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(String).isRequired,
    displayName: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    Meteor.subscribe("profiles");
<<<<<<< HEAD
    const doc = ProfilesDB.find({_id:Meteor.userId()}).fetch()[0];
    //console.log(doc);
    return {
        bio: (!doc||!doc.bio) ? "Bio dummy text" : doc.bio,
        tags: (!doc||!doc.tags) ? ["Tags", "dummy", "text"]: doc.tags,
        displayName: (!doc||!doc.displayName) ? "Display name" : doc.displayName,
=======
    const doc = ProfilesDB.find({ _id: Meteor.userId() }).fetch()[0];
    //console.log(doc);
    return {
        bio: !doc || !doc.bio ? "Bio dummy text" : doc.bio,
        tags: !doc || !doc.tags ? ["Tags", "dummy", "text"] : doc.tags,
        displayName:
            !doc || !doc.displayName ? "Display name" : doc.displayName,
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
        meteorCall: Meteor.call
    };
})(Profile);
