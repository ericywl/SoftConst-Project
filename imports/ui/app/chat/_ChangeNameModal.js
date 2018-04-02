// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

// APIs
import { spaceFilter } from "../../../misc/methods";

export default class ChangeNameModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            newName: "",
            error: ""
        };
    }

    render() {
        const modalStyles = { overlay: { zIndex: 10 } };

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel="Change Name"
                onAfterOpen={() => {
                    this.refs.newName.focus();
                    this.setState({
                        newName: this.props.selectedItemPartial.name
                    });
                }}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__large-box"
                overlayClassName="boxed-view boxed-view__modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <h2 className="boxed-view__modal-title">Change Name</h2>

                {this.state.error ? <p>{this.state.error}</p> : undefined}

                <form
                    className="boxed-view__form"
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <input
                        ref="newName"
                        type="text"
                        value={this.state.newName}
                        onChange={this.handleOnChange.bind(this)}
                    />
                    <button className="button">Submit New Name</button>
                </form>
            </Modal>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        const meteorMethod = this.props.isGroupTab
            ? "groupsNameChange"
            : "dsbjsNameChange";

        this.props.meteorCall(
            meteorMethod,
            this.props.selectedItemPartial._id,
            this.state.newName,
            err => {
                if (err) {
                    this.setState({ error: err.reason });
                } else {
                    this.toggleModal();
                }
            }
        );
    }

    handleOnChange(event) {
        event.preventDefault();
        const inputValue = spaceFilter(event.target.value);
        const inputLength = inputValue.trim().length;
        if (inputValue[0] === " ") return;
        if (inputLength > 30) return;
        if (inputLength === 0 && this.state.newName.length === 0) return;

        this.setState({ newName: inputValue });
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            error: ""
        });
    }
}

ChangeNameModal.propTypes = {
    haveAccess: PropTypes.bool.isRequired,
    isGroupTab: PropTypes.bool.isRequired,
    selectedItemPartial: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired
};
