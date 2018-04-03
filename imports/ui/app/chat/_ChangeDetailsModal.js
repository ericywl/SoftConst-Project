// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

// APIs
import { spaceFilter, numberFilter } from "../../../misc/methods";
import {
    ITEMNAME_MAX_LENGTH,
    GROUPDESC_MAX_LENGTH,
    DSBJDESC_MAX_LENGTH
} from "../../../misc/constants";

export default class ChangeDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            newName: "",
            newDesc: "",
            newNum: "",
            newTimeout: "",
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
                        newName: this.props.selectedItemPartial.name.trim(),
                        newDesc: this.props.selectedItemPartial.description.trim(),
                        newTimeout: String(
                            this.props.selectedItemPartial.timeoutHours
                        ),
                        newNum: String(this.props.selectedItemPartial.numberReq)
                    });
                }}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__box boxed-view__box--l"
                overlayClassName="boxed-view boxed-view__modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <h2 className="boxed-view__modal-message-title">
                    Change Details
                </h2>

                {this.state.error ? <p>{this.state.error}</p> : undefined}

                <form className="boxed-view__form" onSubmit={() => {}}>
                    <div className="boxed-view__form-subtitle">Name</div>
                    <input
                        ref="newName"
                        type="text"
                        value={this.state.newName}
                        onChange={this.handleNameChange.bind(this)}
                    />

                    <div className="boxed-view__form-subtitle">Description</div>
                    <textarea
                        ref="newDesc"
                        value={this.state.newDesc}
                        onChange={this.handleDescChange.bind(this)}
                    />

                    {this.props.isGroupTab ? (
                        undefined
                    ) : (
                        <div className="boxed-view__form-subtitle">Timeout</div>
                    )}

                    {this.props.isGroupTab ? (
                        undefined
                    ) : (
                        <input
                            name="newTimeout"
                            ref="newTimeout"
                            type="text"
                            value={this.state.newTimeout}
                            onChange={this.handleTimeoutChange.bind(this)}
                        />
                    )}

                    {this.props.isGroupTab ? (
                        undefined
                    ) : (
                        <div className="boxed-view__form-subtitle">
                            Required number of people (0 for unlimited)
                        </div>
                    )}

                    {this.props.isGroupTab ? (
                        undefined
                    ) : (
                        <input
                            ref="newNum"
                            type="text"
                            value={this.state.newNum}
                            onChange={this.handlePeopleChange.bind(this)}
                        />
                    )}

                    <div className="button__side-by-side button__side-by-side--uneven">
                        <button
                            type="button"
                            className="button button--greyed"
                            onClick={this.toggleModal.bind(this)}
                        >
                            Cancel
                        </button>
                        <button
                            className="button"
                            onClick={this.handleSubmit.bind(this)}
                        >
                            Submit New Details
                        </button>
                    </div>
                </form>
            </Modal>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.checkDetails()) return;

        const meteorMethod = this.props.isGroupTab
            ? "groupsDetailsChange"
            : "dsbjsDetailsChange";

        const partialNewItem = {
            name: this.state.newName.trim(),
            description: this.state.newDesc.trim()
        };

        if (!this.props.isGroupTab) {
            partialNewItem["timeout"] = Number(this.state.newTimeout);
            partialNewItem["numberReq"] = Number(this.state.newNum);
        }

        this.props.meteorCall(
            meteorMethod,
            this.props.selectedItemPartial._id,
            partialNewItem,
            err => {
                if (err) {
                    this.setState({ error: err.reason });
                } else {
                    this.toggleModal();
                }
            }
        );
    }

    handleNameChange(event) {
        event.preventDefault();
        const inputValue = spaceFilter(event.target.value);
        const inputLength = inputValue.trim().length;
        if (inputValue[0] === " ") return;
        if (inputLength > ITEMNAME_MAX_LENGTH) return;
        if (inputLength === 0 && this.state.newName.length === 0) return;

        this.setState({ newName: inputValue });
    }

    handleDescChange(event) {
        event.preventDefault();
        const inputValue = spaceFilter(event.target.value);
        const inputLength = inputValue.trim().length;
        if (inputValue[0] === " ") return;

        const maxLen =
            this.props.selectedTab === "groups"
                ? GROUPDESC_MAX_LENGTH
                : DSBJDESC_MAX_LENGTH;
        if (inputLength > maxLen) return;
        if (inputLength === 0 && this.state.newDesc.length === 0) return;

        this.setState({ newDesc: inputValue });
    }

    handleTimeoutChange(event) {
        event.preventDefault();
        const inputValue = numberFilter(event.target.value);
        if (inputValue[0] === "0") return;
        if (inputValue.length > 3) return;

        this.setState({ newTimeout: inputValue });
    }

    handlePeopleChange(event) {
        event.preventDefault();
        const inputValue = numberFilter(event.target.value);
        if (inputValue === "00") return;
        if (inputValue.length > 2) return;

        this.setState({ newNum: inputValue });
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            error: ""
        });
    }

    checkDetails() {
        const groupCheck =
            this.state.newName.trim() ===
                this.props.selectedItemPartial.name.trim() &&
            this.state.newDesc.trim() ===
                this.props.selectedItemPartial.description.trim();

        const dsbjCheck =
            this.state.newTimeout ===
                String(this.props.selectedItemPartial.timeoutHours) &&
            this.state.newNum ===
                String(this.props.selectedItemPartial.numberReq) &&
            groupCheck;

        if (this.props.isGroupTab) {
            if (groupCheck) {
                this.setState({ error: "Details not changed" });
                setTimeout(() => this.setState({ error: "" }), 10000);
                return false;
            }
        } else {
            if (dsbjCheck) {
                this.setState({ error: "Details not changed" });
                setTimeout(() => this.setState({ error: "" }), 10000);
                return false;
            }
        }

        return true;
    }
}

ChangeDetailsModal.propTypes = {
    haveAccess: PropTypes.bool.isRequired,
    isGroupTab: PropTypes.bool.isRequired,
    selectedItemPartial: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired
};
