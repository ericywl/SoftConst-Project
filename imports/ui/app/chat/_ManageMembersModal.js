// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

// APIs
import { GroupsDB } from "../../../api/groups";
import { tagFilter } from "../../../misc/methods";

export default class ManageTagsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            error: ""
        };
    }

    render() {
        const modalStyles = { overlay: { zIndex: 10 } };

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel="Manage Tags"
                onAfterOpen={() => this.refs.newTag.focus()}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__box boxed-view__box--l"
                overlayClassName="boxed-view boxed-view__modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                Hi
            </Modal>
        );
    }

    renderTags() {
        if (this.props.selectedItemPartial.tags.length === 0) {
            return (
                <div className="empty-tags">There are no tags currently.</div>
            );
        }

        return this.props.selectedItemPartial.tags.map((tag, index) => (
            <span className="tags__tag" key={`tag${index}`}>
                <span className="tags__tag--hash"># </span>
                <span>{tag}</span>
                {this.props.haveAccess ? (
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
        const tagRemove = this.props.isGroupTab
            ? "groupsTagRemove"
            : "dsbjsTagRemove";

        this.props.meteorCall(
            tagRemove,
            this.props.selectedItemPartial._id,
            tagName,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                    setTimeout(() => this.setState({ error: "" }), 10000);
                }
            }
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newTag === "") return;

        const tagAdd = this.props.isGroupTab ? "groupsTagAdd" : "dsbjsTagAdd";
        this.props.meteorCall(
            tagAdd,
            this.props.selectedItemPartial._id,
            this.state.newTag,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                    setTimeout(() => this.setState({ error: "" }), 10000);
                }
            }
        );

        this.setState({ newTag: "" });
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            error: ""
        });
    }
}

ManageTagsModal.propTypes = {
    haveAccess: PropTypes.bool.isRequired,
    isGroupTab: PropTypes.bool.isRequired,
    selectedItemPartial: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired
};
