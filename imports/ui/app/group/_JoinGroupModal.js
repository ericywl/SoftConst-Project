// Library
import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { withTracker } from "meteor/react-meteor-data";

// APIs
import { ProfilesDB } from "../../../api/profiles";
import {
    capitalizeFirstLetter,
    numberFilter,
    spaceFilter
} from "../../../misc/methods";

export default class JoinGroupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            itemId: "",
            error: ""
        };
    }

    componentWillMount() {
        Modal.setAppElement("body");
    }

    render() {
        const selectedTab = this.props.selectedTab;
        const isGroupTab = selectedTab === "groups";
        const formattedTabText = capitalizeFirstLetter(
            selectedTab.slice(0, selectedTab.length - 1)
        );
        const modalStyles = { overlay: { zIndex: 10 } };

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel={"Join " + formattedTabText + " via Invite"}
                onAfterOpen={() => this.refs.itemId.focus()}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__large-box"
                overlayClassName="boxed-view modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <h1 className="modal__title">
                    {"Join " + formattedTabText + " via Invite"}
                </h1>

                {this.state.error ? <p>{this.state.error}</p> : undefined}

                <form
                    onSubmit={event => event.preventDefault()}
                    className="boxed-view__form"
                >
                    <input
                        name="itemId"
                        ref="itemId"
                        type="text"
                        placeholder="Invitation ID"
                        value={this.state.itemId}
                        onChange={this.handleIdChange.bind(this)}
                    />

                    <button
                        type="button"
                        className="button"
                        onClick={this.handleSubmit.bind(this)}
                    >
                        Join {formattedTabText}
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
        event.preventDefault();
        const itemId = this.state.itemId.trim();
        if (itemId.match(/[^a-z0-9]/gi)) {
            this.setState({ error: "Invalid invitation ID" });
            setTimeout(() => {
                this.setState({ error: "" });
            }, 10000);
            return;
        }

        this.props.meteorCall("profilesJoinGroup", itemId, err => {
            if (err) {
                this.setState({ error: err.reason });
                setTimeout(() => {
                    this.setState({ error: "" });
                }, 10000);
            } else {
                this.props.session.set("selectedGroupId", itemId);
                this.toggleModal();
            }
        });
    }

    handleIdChange(event) {
        event.preventDefault();
        const inputValue = event.target.value.replace(/\s/gi, "");
        const inputLength = inputValue.length;
        if (inputValue[0] === " ") return;
        if (inputLength > 30) return;
        if (inputLength === 0 && this.state.itemId.length === 0) return;

        this.setState({ itemId: inputValue });
    }

    toggleModal() {
        Session.set("isModalOpen", !this.state.modalIsOpen);

        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            itemId: "",
            error: ""
        });
    }
}

JoinGroupModal.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};
