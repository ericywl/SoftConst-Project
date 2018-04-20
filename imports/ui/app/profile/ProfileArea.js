// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

// APIs
import { ProfilesDB } from "../../../api/profiles";
import { GroupsDB } from "../../../api/groups";
import { tagFilter } from "../../../misc/methods";
import { USERNAME_MAX_LENGTH, BIO_MAX_LENGTH } from "../../../misc/constants";
import { spaceFilter } from "../../../misc/methods";

export class ProfileArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            newTag: "",
            newName: "",
            newBio: "",
            error: ""
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const prevOwnProfile = prevProps.selectedProfileId === "";
        const ownProfile = this.props.selectedProfileId === "";

        if (this.state.editMode && !prevState.editMode && this.props.profile) {
            this.setState({
                newName: this.props.profile.displayName,
                newBio: this.props.profile.bio
            });
        }

        if (prevOwnProfile && !ownProfile) {
            this.setState({ editMode: false });
        }
    }

    render() {
        if (!this.props.profile) {
            return <div>hi</div>;
        }

        const ownProfile = this.props.selectedProfileId === "";
        return (
            <div className="profile-area">
                <div className="profile-area__header">
                    <h2 className="profile-area__header-title">
                        {ownProfile
                            ? this.state.editMode
                                ? "Edit Your Profile"
                                : "Your Profile"
                            : `${this.props.profile.displayName}'s Profile`}
                    </h2>

                    {ownProfile ? (
                        this.state.editMode ? (
                            <img
                                className="profile-area__header-edit"
                                src="/images/tick.png"
                                onClick={this.handleUpdate.bind(this)}
                            />
                        ) : (
                            <img
                                className="profile-area__header-edit"
                                src="/images/pencil.png"
                                onClick={() =>
                                    this.setState({ editMode: true })
                                }
                            />
                        )
                    ) : (
                        undefined
                    )}
                </div>

                <div className="profile-area__item">
                    <h4 className="profile__key">ID</h4>
                    <h3 className="profile__value">{this.props.profile._id}</h3>
                </div>

                {ownProfile ? (
                    <div className="profile-area__item">
                        <h4 className="profile__key">Display Name</h4>
                        {this.state.editMode ? (
                            <input
                                type="text"
                                className="profile-area__input"
                                value={this.state.newName}
                                onChange={this.handleNameChange.bind(this)}
                            />
                        ) : (
                            <h3 className="profile__value">
                                {this.props.profile.displayName}
                            </h3>
                        )}
                    </div>
                ) : (
                    undefined
                )}

                <div className="profile-area__item">
                    <h4 className="profile__key">About</h4>
                    {this.state.editMode && ownProfile ? (
                        <textarea
                            className="profile-area__textarea"
                            value={this.state.newBio}
                            onChange={this.handleBioChange.bind(this)}
                        />
                    ) : (
                        <h3 className="profile__value">
                            {this.props.profile.bio === ""
                                ? "N/A"
                                : this.props.profile.bio}
                        </h3>
                    )}
                </div>

                <div className="profile-area__item">
                    <h4 className="profile__key">Public Groups</h4>
                    <div
                        className="profile-area__groups"
                        ref={el => {
                            this.publicGroups = el;
                        }}
                    >
                        {this.renderGroups(this.props.publicGroups)}
                    </div>
                </div>

                {ownProfile ? (
                    <div className="profile-area__item">
                        <h4 className="profile__key">Private Groups</h4>
                        <div
                            className="profile-area__groups"
                            ref={el => {
                                this.privateGroups = el;
                            }}
                        >
                            {this.renderGroups(this.props.privateGroups)}
                        </div>
                    </div>
                ) : (
                    undefined
                )}

                <div className="profile-area__item">
                    <h4 className="profile__key">Tags</h4>
                    <FlipMove
                        style={{ marginBottom: "1rem" }}
                        duration={this.state.editMode ? 100 : 0}
                        enterAnimation={this.state.editMode ? "fade" : "none"}
                        leaveAnimation={this.state.editMode ? "fade" : "none"}
                    >
                        {this.renderTags()}
                    </FlipMove>
                    {this.state.editMode && ownProfile ? (
                        <form
                            className="profile-area__form"
                            onSubmit={this.handleTagAdd.bind(this)}
                        >
                            <input
                                ref="newTag"
                                name="newTag"
                                className="profile-area__input"
                                type="text"
                                value={this.state.newTag}
                                onChange={this.handleTagChange.bind(this)}
                            />

                            <button className="profile-area__button button">
                                Add Tag
                            </button>
                        </form>
                    ) : (
                        undefined
                    )}
                </div>
            </div>
        );
    }

    renderGroups(groups) {
        if (groups.length === 0) {
            return <h3 className="profile__value">N/A</h3>;
        }

        return groups.map((group, index) => (
            <div className="profile-area__group" key={`group${index}`}>
                {group.name}
            </div>
        ));
    }

    renderTags() {
        if (this.props.profile.tags.length === 0) {
            return <h3 className="profile__value">N/A</h3>;
        }

        return this.props.profile.tags.map((tag, index) => (
            <span className="tag" key={`tag${index}`}>
                <span className="tag__hash"># </span>
                <span>{tag}</span>
                {this.state.editMode ? (
                    <img
                        className="tag__cross"
                        src="/images/round_x.svg"
                        onClick={this.handleTagDelete.bind(this)}
                    />
                ) : (
                    undefined
                )}
            </span>
        ));
    }

    handleNameChange(event) {
        event.preventDefault();
        const inputValue = spaceFilter(event.target.value);
        const inputLength = inputValue.trim().length;
        if (inputValue[0] === " ") return;
        if (inputLength > USERNAME_MAX_LENGTH) return;
        if (inputLength === 0 && this.state.newName.length === 0) return;

        this.setState({ newName: inputValue });
    }

    handleBioChange(event) {
        event.preventDefault();
        const inputValue = spaceFilter(event.target.value);
        const inputLength = inputValue.trim().length;
        if (inputValue[0] === " ") return;
        if (inputLength > BIO_MAX_LENGTH) return;
        if (inputLength === 0 && this.state.newDesc.length === 0) return;

        this.setState({ newBio: inputValue });
    }

    handleTagChange(event) {
        event.preventDefault();
        const input = tagFilter(event.target.value.trim());
        if (input.length > 33) return;

        this.setState({ newTag: input });
    }

    handleTagAdd(event) {
        event.preventDefault();
        if (this.state.newTag === "") return;

        this.props.meteorCall(
            "profilesTagAdd",
            this.state.newTag,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                    setTimeout(() => this.setState({ error: "" }), 10000);
                } else {
                    this.setState({ newTag: "" });
                }
            }
        );
    }

    handleTagDelete(event) {
        event.preventDefault();
        const tagName = event.target.parentElement.children[1].innerHTML;

        this.props.meteorCall("profilesTagRemove", tagName, (err, res) => {
            if (err) {
                this.setState({ error: err.reason });
                setTimeout(() => this.setState({ error: "" }), 10000);
            }
        });
    }

    handleUpdate(event) {
        event.preventDefault();
        if (
            this.state.newName.trim() !== this.props.profile.displayName ||
            this.state.newBio.trim() !== this.props.profile.newBio
        )
            this.props.meteorCall(
                "profilesUpdate",
                this.state.newName.trim(),
                this.state.newBio.trim()
            );

        this.setState({ editMode: false });
    }
}

export default withTracker(() => {
    const selectedProfileId = Session.get("selectedProfileId");
    Meteor.subscribe("groups");

    let profile;
    let privateGroups = [];
    if (selectedProfileId === "") {
        profile = ProfilesDB.findOne({ _id: Meteor.userId() });
    } else {
        profile = ProfilesDB.findOne({ _id: selectedProfileId });
    }

    const publicGroups = profile
        ? GroupsDB.find(
              {
                  _id: { $in: profile.groups },
                  "tags.0": { $exists: true }
              },
              { sort: { lastMessageAt: -1 } }
          ).fetch()
        : [];

    if (selectedProfileId === "") {
        privateGroups = profile
            ? GroupsDB.find(
                  {
                      _id: { $in: profile.groups },
                      "tags.0": { $exists: false }
                  },
                  { sort: { lastMessageAt: -1 } }
              ).fetch()
            : [];
    }

    return {
        selectedProfileId,
        profile,
        publicGroups,
        privateGroups,
        meteorCall: Meteor.call
    };
})(ProfileArea);
