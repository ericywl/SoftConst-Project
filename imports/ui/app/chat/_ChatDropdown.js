// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Clipboard from "clipboard";

// React Components
import ManageTagsModal from "./_ManageTagsModal";
import ManageMembersModal from "./_ManageMembersModal";
import ChangeDetailsModal from "./_ChangeDetailsModal";
import { capitalizeFirstLetter } from "../../../misc/methods";

export default class ChatDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownIsOpen: false,
            idCopied: false
        };
    }

    render() {
        const isGroupTab = this.props.selectedTab === "groups";
        const moderatorIds = isGroupTab
            ? this.props.selectedItem.moderators
            : [];
        const noMembers = isGroupTab
            ? this.props.selectedItem.members.length === 0
            : this.props.selectedItem.attendees.length === 0;
        const tabText = capitalizeFirstLetter(
            this.props.selectedTab.slice(0, this.props.selectedTab.length - 1)
        );

        const selectedItemPartial = {
            _id: this.props.selectedItem._id,
            name: this.props.selectedItem.name,
            description: this.props.selectedItem.description,
            tags: this.props.selectedItem.tags,
            timeoutHours: this.props.selectedItem.timeoutHours,
            createdAt: this.props.selectedItem.createdAt,
            numberReq: this.props.selectedItem.numberReq
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
                            name="details"
                            className="dropdown__item"
                            onClick={event => {
                                event.preventDefault();
                                this.childDetailsModal.toggleModal();
                                this.setState({ dropdownIsOpen: false });
                            }}
                        >
                            Change {tabText} Details
                        </div>
                    ) : (
                        undefined
                    )}

                    <div
                        name="tags"
                        className="dropdown__item"
                        onClick={event => {
                            event.preventDefault();
                            this.childTagsModal.toggleModal();
                            this.setState({ dropdownIsOpen: false });
                        }}
                    >
                        {haveAccess
                            ? "Manage " + tabText + " Tags"
                            : "View " + tabText + " Tags"}
                    </div>

                    {haveAccess ? (
                        <div
                            className="dropdown__item"
                            onClick={event => {
                                event.preventDefault();
                                this.childMembersModal.toggleModal();
                                this.setState({ dropdownIsOpen: false });
                            }}
                        >
                            Manage Members
                        </div>
                    ) : (
                        undefined
                    )}

                    {haveAccess ? (
                        <div
                            className="dropdown__item"
                            ref="copy"
                            data-clipboard-text={selectedItemPartial._id}
                        >
                            {this.state.idCopied
                                ? "ID Copied!"
                                : `Copy ${tabText} ID`}
                        </div>
                    ) : (
                        undefined
                    )}

                    {this.props.isOwner && !noMembers ? (
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
                            this.childDetailsModal = ref;
                        }}
                    />
                ) : (
                    undefined
                )}

                {haveAccess ? (
                    <ManageMembersModal
                        selectedItemId={this.props.selectedItem._id}
                        moderatorIds={moderatorIds}
                        members={this.props.members}
                        isGroupTab={isGroupTab}
                        isOwner={this.props.isOwner}
                        isModerator={this.props.isModerator}
                        meteorCall={this.props.meteorCall}
                        ref={ref => {
                            this.childMembersModal = ref;
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

        document.addEventListener(
            "touchstart",
            this.handleClickOutside.bind(this)
        );

        if (this.props.isModerator || this.props.isOwner) {
            this.clipboard = new Clipboard(this.refs.copy);

            this.clipboard.on("success", event => {
                this.setState({ idCopied: true });
                setTimeout(() => this.setState({ idCopied: false }), 2000);
            });

            this.clipboard.on("error", () =>
                console.log("Auto-copying did not work!")
            );
        }
    }

    componentWillUnmount() {
        document.removeEventListener(
            "mousedown",
            this.handleClickOutside.bind(this)
        );

        document.removeEventListener(
            "touchstart",
            this.handleClickOutside.bind(this)
        );

        if (this.props.isModerator || this.props.isOwner)
            this.clipboard.destroy();
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        const inWrapperRef =
            this.wrapperRef && !this.wrapperRef.contains(event.target);

        if (
            inWrapperRef ||
            event.target.className ===
                "dropdown__control dropdown__control--open"
        ) {
            if (this.state.dropdownIsOpen)
                this.setState({ dropdownIsOpen: false });
        }
    }

    handleLeaveOnClick(event) {
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
    members: PropTypes.array.isRequired,
    selectedItem: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired,
    notInItem: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isModerator: PropTypes.bool.isRequired,
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};
