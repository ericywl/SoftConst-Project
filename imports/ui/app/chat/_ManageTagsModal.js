// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

// APIs
import { GroupsDB } from "../../../api/groups";
import { tagFilter } from "../../../misc/misc";

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
                <h3 className="tags__title">
                    {this.props.selectedGroup.name} Tags
                </h3>
                <FlipMove
                    className="tags"
                    duration={100}
                    enterAnimation="fade"
                    leaveAnimation="fade"
                >
                    {this.renderTags()}
                </FlipMove>

                {this.props.isModerator ? (
                    <form
                        className="boxed-view__form--row"
                        onSubmit={this.handleSubmit.bind(this)}
                    >
                        <input
                            ref="newTag"
                            name="newTag"
                            className="tags__input"
                            type="text"
                            value={this.state.newTag}
                            onChange={this.handleTagChange.bind(this)}
                        />
                        <button className="button button--tag">Add tags</button>
                    </form>
                ) : (
                    undefined
                )}
            </Modal>
        );
    }

    renderTags() {
        if (this.props.selectedGroup.tags.length === 0) {
            return (
                <div className="empty-tags">There are no tags currently.</div>
            );
        }

        return this.props.selectedGroup.tags.map((tag, index) => (
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

    handleTagChange(event) {
        event.preventDefault();
        const input = tagFilter(event.target.value.trim());
        if (input.length > 33) return;

        this.setState({ newTag: input });
    }

    handleTagDelete(event) {
        event.preventDefault();
        const tagName = event.target.parentElement.children[1].innerHTML;

        this.props.meteorCall(
            "groupsRemoveTag",
            this.props.selectedGroup._id,
            tagName
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newTag === "") return;

        this.props.meteorCall(
            "groupsAddTag",
            this.props.selectedGroup._id,
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
    isModerator: PropTypes.bool.isRequired,
    selectedGroup: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired
};
