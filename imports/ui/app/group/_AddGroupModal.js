import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { withTracker } from "meteor/react-meteor-data";

import { ProfilesDB } from "../../../api/profiles";

export default class AddGroupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            groupName: "",
            groupDesc: "",
            groupPrivate: false,
            error: ""
        };
    }

    componentWillMount() {
        Modal.setAppElement("body");
    }

    render() {
        const modalStyles = { overlay: { zIndex: 10 } };

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel="Create New Group"
                onAfterOpen={() => this.refs.groupName.focus()}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__large-box"
                overlayClassName="boxed-view boxed-view--modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <h1>
                    {this.state.groupName ? this.state.groupName : "New Group"}
                </h1>

                {this.state.error ? <p>{this.state.error}</p> : undefined}

                <form
                    onSubmit={event => event.preventDefault()}
                    className="boxed-view__form"
                >
                    <input
                        name="groupName"
                        ref="groupName"
                        type="text"
                        placeholder="Name"
                        value={this.state.groupName}
                        onChange={this.handleNameChange.bind(this)}
                    />

                    <textarea
                        name="groupDesc"
                        ref="groupDesc"
                        type="text"
                        placeholder="Description"
                        value={this.state.groupDesc}
                        onChange={this.handleDescChange.bind(this)}
                    />

                    <div className="switch">
                        <label className="switch__box">
                            <input
                                ref="groupPrivate"
                                className="switch__input"
                                type="checkbox"
                                onClick={event =>
                                    this.setState({
                                        groupPrivate: event.target.checked
                                    })
                                }
                            />
                            <span className="switch__slider" />
                        </label>
                        <div className="switch__text">Private</div>
                    </div>

                    <button
                        type="button"
                        className="button"
                        onClick={this.handleSubmit.bind(this)}
                    >
                        Create Group
                    </button>

                    <button
                        type="button"
                        className="button button--greyed"
                        onClick={this.toggleModal.bind(this)}
                    >
                        Cancel
                    </button>
                </form>
            </Modal>
        );
    }

    handleSubmit(event) {
        const partialGroup = {
            name: this.state.groupName,
            description: this.state.groupDesc,
            isPrivate: this.state.groupPrivate
        };

        event.preventDefault();

        this.props.meteorCall("groupsInsert", partialGroup, (err, res) => {
            if (err) this.setState({ error: err.reason });

            if (res) {
                try {
                    this.props.meteorCall("profilesJoinGroup", res);
                } catch (err) {
                    // remove group from db
                    throw new Meteor.Error("profiles-join-group-failed");
                }

                Session.set("selectedGroupId", res);
                this.toggleModal();
            }
        });
    }

    handleNameChange(event) {
        const inputValue = event.target.value;
        const inputLength = inputValue.trim().length;
        if (inputLength > 30) return;
        if (inputLength === 0 && this.state.groupName.length === 0) return;

        this.setState({ groupName: inputValue });
    }

    handleDescChange(event) {
        const inputValue = event.target.value;
        const inputLength = inputValue.trim().length;
        if (inputLength > 50) return;
        if (inputLength === 0 && this.state.groupDesc.length === 0) return;

        this.setState({ groupDesc: inputValue });
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            groupName: "",
            groupDesc: "",
            error: ""
        });
    }
}
