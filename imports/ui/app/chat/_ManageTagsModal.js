import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

import { GroupsDB } from "../../../api/groups";

export default class ManageTagsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            newTag: "",
            error: ""
        };
    }

    render() {
        const modalStyles = { overlay: { zIndex: 10 } };

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel="Create New Group"
                onAfterOpen={() => {}}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__large-box"
                overlayClassName="boxed-view boxed-view--modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <div className="boxed-view__form">
                    <div className="tags">{this.renderTags()}</div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input
                            ref="newTag"
                            name="newTag"
                            type="text"
                            value={this.state.newTag}
                            onChange={this.handleTagChange.bind(this)}
                        />
                        <button className="button button--tag">Add tags</button>
                    </form>
                </div>
            </Modal>
        );
    }

    renderTags() {
        return this.props.groupTags.map((tag, index) => (
            <span
                style={{ float: "left", padding: "0 0.5rem" }}
                key={`tag${index}`}
            >
                #{tag}
            </span>
        ));
    }

    handleTagChange(event) {
        event.preventDefault();
        this.setState({ newTag: event.target.value.trim() });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.meteorCall(
            "groupsAddTag",
            this.props.selectedGroupId,
            this.state.newTag,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                }
            }
        );

        this.setState({ newTag: "" });
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            newTag: "",
            error: ""
        });
    }
}

ManageTagsModal.propTypes = {
    selectedGroupId: PropTypes.string.isRequired,
    groupTags: PropTypes.array.isRequired
};
