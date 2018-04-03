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
import {
    ITEMNAME_MAX_LENGTH,
    GROUPDESC_MAX_LENGTH,
    DSBJDESC_MAX_LENGTH
} from "../../../misc/constants";

export default class AddGroupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            itemName: "",
            itemDesc: "",
            itemNumOfPeople: "",
            itemTimeout: "",
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
                contentLabel={"Create New " + formattedTabText}
                onAfterOpen={() => this.refs.itemName.focus()}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__box boxed-view__box--l"
                overlayClassName="boxed-view boxed-view__modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <h1 className="boxed-view__modal-title ellipsis">
                    {this.state.itemName
                        ? this.state.itemName
                        : "New " + formattedTabText}
                </h1>

                {this.state.error ? <p>{this.state.error}</p> : undefined}

                <form
                    onSubmit={event => event.preventDefault()}
                    className="boxed-view__form"
                >
                    <input
                        name="itemName"
                        ref="itemName"
                        type="text"
                        placeholder="Name"
                        value={this.state.itemName}
                        onChange={this.handleNameChange.bind(this)}
                    />

                    <textarea
                        name="itemDesc"
                        ref="itemDesc"
                        type="text"
                        placeholder="Description"
                        value={this.state.itemDesc}
                        onChange={this.handleDescChange.bind(this)}
                    />

                    {isGroupTab ? (
                        undefined
                    ) : (
                        <input
                            name="itemNumOfPpl"
                            ref="itemNumOfPpl"
                            type="text"
                            placeholder="Required No. of people (0 for unlimited)"
                            value={this.state.itemNumOfPeople}
                            onChange={this.handlePeopleChange.bind(this)}
                        />
                    )}

                    {isGroupTab ? (
                        undefined
                    ) : (
                        <input
                            name="itemTimeout"
                            ref="itemTimeout"
                            type="text"
                            placeholder="Timeout in hours"
                            value={this.state.itemTimeout}
                            onChange={this.handleTimeoutChange.bind(this)}
                        />
                    )}

                    <button
                        type="button"
                        className="button"
                        onClick={this.handleSubmit.bind(this)}
                    >
                        Create {formattedTabText}
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
        const isGroupTab = this.props.selectedTab === "groups";
        let partialItem, meteorMethod;
        if (isGroupTab) {
            meteorMethod = "groupsInsert";
            partialItem = {
                name: this.state.itemName,
                description: this.state.itemDesc
            };
        } else {
            meteorMethod = "dsbjsInsert";
            partialItem = {
                name: this.state.itemName,
                description: this.state.itemDesc,
                timeout: Number(this.state.itemTimeout),
                numberReq: Number(this.state.itemNumOfPeople)
            };
        }

        this.props.meteorCall(meteorMethod, partialItem, (err, res) => {
            if (err) {
                this.setState({ error: err.reason });
                setTimeout(() => {
                    this.setState({ error: "" });
                }, 10000);
            } else {
                this.toggleModal();
                const selectedText = isGroupTab
                    ? "selectedGroupId"
                    : "selectedDsbjId";
                this.props.session.set(selectedText, res);
            }
        });
    }

    handleNameChange(event) {
        event.preventDefault();
        const inputValue = spaceFilter(event.target.value);
        const inputLength = inputValue.trim().length;
        if (inputValue[0] === " ") return;
        if (inputLength > ITEMNAME_MAX_LENGTH) return;
        if (inputLength === 0 && this.state.itemName.length === 0) return;

        this.setState({ itemName: inputValue });
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
        if (inputLength === 0 && this.state.itemDesc.length === 0) return;

        this.setState({ itemDesc: inputValue });
    }

    handleTimeoutChange(event) {
        event.preventDefault();
        const inputValue = numberFilter(event.target.value);
        if (inputValue[0] === "0") return;
        if (inputValue.length > 3) return;

        this.setState({ itemTimeout: inputValue });
    }

    handlePeopleChange(event) {
        event.preventDefault();
        const inputValue = numberFilter(event.target.value);
        if (inputValue === "00") return;
        if (inputValue.length > 2) return;

        this.setState({ itemNumOfPeople: inputValue });
    }

    toggleModal() {
        Session.set("isModalOpen", !this.state.modalIsOpen);

        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            itemName: "",
            itemDesc: "",
            itemNumOfPpl: "",
            itemTimeout: "",
            itemPrivate: false,
            error: ""
        });
    }
}

AddGroupModal.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    meteorCall: PropTypes.func.isRequired
};
