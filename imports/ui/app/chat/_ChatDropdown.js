// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// React Components
import ManageTagsModal from "./_ManageTagsModal";
import ChangeDetailsModal from "./_ChangeDetailsModal";
import { capitalizeFirstLetter } from "../../../misc/methods";

export default class ChatDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownIsOpen: false
        };
    }

    render() {
        const isGroupTab = this.props.selectedTab === "groups";
        const tabText = capitalizeFirstLetter(
            this.props.selectedTab.slice(0, this.props.selectedTab.length - 1)
        );

        const selectedItemPartial = {
            _id: this.props.selectedItem._id,
            name: this.props.selectedItem.name,
            description: this.props.selectedItem.description,
            tags: this.props.selectedItem.tags
        };

        let haveAccess;
        if (isGroupTab) {
            haveAccess = this.props.isModerator || this.props.isOwner;
        } else {
            haveAccess = this.props.isOwner;
        }

        return (
            <div
                className="dropdown noselect"
                ref={this.setWrapperRef.bind(this)}
            >
                <div
                    className={
                        "dropdown__control" +
                        (this.state.dropdownIsOpen
                            ? " dropdown__control--open"
                            : "")
                    }
                >
                    <div className="dropdown__placeholder" />
                    <img
                        src="/images/more.png"
                        className="dropdown__trigger"
                        onClick={() => {
                            this.setState({
                                dropdownIsOpen: !this.state.dropdownIsOpen
                            });
                        }}
                    />
                </div>

                <div
                    className="dropdown__menu"
                    ref="menu"
                    hidden={!this.state.dropdownIsOpen}
                >
                    {haveAccess ? (
                        <div
                            className="dropdown__item"
                            onClick={() => {
                                this.childNameModal.toggleModal();
                                this.setState({ dropdownIsOpen: false });
                            }}
                        >
                            Change {tabText} Details
                        </div>
                    ) : (
                        undefined
                    )}

                    <div
                        className="dropdown__item"
                        onClick={() => {
                            this.childTagsModal.toggleModal();
                            this.setState({ dropdownIsOpen: false });
                        }}
                    >
                        {haveAccess
                            ? "Manage " + tabText + " Tags"
                            : "View " + tabText + " Tags"}
                    </div>

                    {this.props.isOwner ? (
                        <div className="dropdown__item dropdown__item--disabled">
                            Leave {tabText}
                        </div>
                    ) : (
                        <div
                            className="dropdown__item"
                            onClick={this.handleLeaveOnClick.bind(this)}
                        >
                            Leave {tabText}
                        </div>
                    )}
                </div>

                <ManageTagsModal
                    haveAccess={haveAccess}
                    isGroupTab={isGroupTab}
                    selectedItemPartial={selectedItemPartial}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.childTagsModal = ref;
                    }}
                />

                {haveAccess ? (
                    <ChangeDetailsModal
                        haveAccess={haveAccess}
                        isGroupTab={isGroupTab}
                        selectedItemPartial={selectedItemPartial}
                        meteorCall={this.props.meteorCall}
                        ref={ref => {
                            this.childNameModal = ref;
                        }}
                    />
                ) : (
                    undefined
                )}
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );
    }

    componentWillUnmount() {
        document.removeEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (
            (this.wrapperRef && !this.wrapperRef.contains(event.target)) ||
            event.target.className ===
                "dropdown__control dropdown__control--open"
        ) {
            this.setState({ dropdownIsOpen: false });
        }
    }

    handleLeaveOnClick(event) {
        if (this.props.isOwner) {
            throw new Meteor.Error("owner-cannot-leave");
        }

        const meteorMethod =
            this.props.selectedTab === "groups"
                ? "profilesLeaveGroup"
                : "profilesLeaveDsbj";

        this.props.meteorCall(meteorMethod, this.props.selectedItem._id);

        const sessionItemStr =
            this.props.selectedTab === "groups"
                ? "selectedGroupId"
                : "selectedDsbjId";

        this.setState({ dropdownIsOpen: false });
        this.props.session.set(sessionItemStr, "");
        this.props.session.set("sessionTime", moment().valueOf());
    }
}

ChatDropdown.propTypes = {
    selectedItem: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired,
    notInItem: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isModerator: PropTypes.bool.isRequired,
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};
