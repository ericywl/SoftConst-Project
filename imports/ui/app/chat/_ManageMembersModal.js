// Library
import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";
import Modal from "react-modal";

// APIs
import { GroupsDB } from "../../../api/groups";
import { tagFilter } from "../../../misc/methods";

export default class ManageMembersModal extends React.Component {
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
                contentLabel="Manage Members"
                onAfterOpen={() => {}}
                onRequestClose={this.toggleModal.bind(this)}
                className="boxed-view__box boxed-view__box--l"
                overlayClassName="boxed-view boxed-view__modal"
                shouldReturnFocusAfterClose={false}
                style={modalStyles}
            >
                <h2 className="boxed-view__modal-title members__title">
                    {this.props.isModerator || this.props.isOwner
                        ? "Manage Members"
                        : "View Members"}
                </h2>
                {this.props.owner ? (
                    <div>
                        <h4 className="members__subtitle">
                            {this.props.isGroupTab ? "Owner" : "Creator"}
                        </h4>
                        <div className="members__list members__list--owner">
                            <div className="member">
                                <div className="member__name ellipsis">
                                    {this.props.owner.displayName}
                                </div>
                                <div className="member__id">
                                    {this.props.owner._id}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    undefined
                )}
                {this.renderAll()}
            </Modal>
        );
    }

    renderAll() {
        if (!this.props.members) {
            return (
                <div className="empty-members">
                    There are no members currently.
                </div>
            );
        }

        if (this.props.members.length === 0) {
            return (
                <div className="empty-members">
                    There are no members currently.
                </div>
            );
        }

        let moderators = [];
        let members = [];

        if (this.props.isGroupTab) {
            this.props.members.map(member => {
                if (this.props.moderatorIds.includes(member._id)) {
                    moderators.push(member);
                } else {
                    members.push(member);
                }
            });
        } else {
            members = this.props.members;
        }

        const marginBtmClass =
            members.length === 0 ? "" : " members__list--mod";

        return (
            <div className="members__wrapper">
                {moderators.length === 0 ? (
                    undefined
                ) : (
                    <div>
                        <h4 className="members__subtitle">Moderators</h4>
                        <div className={"members__list" + marginBtmClass}>
                            {this.renderModerators(moderators)}
                        </div>
                    </div>
                )}

                {members.length === 0 ? (
                    undefined
                ) : (
                    <div>
                        <h4 className="members__subtitle">Members</h4>
                        <div className="members__list">
                            {this.renderMembers(members)}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    renderModerators(moderators) {
        const haveAccess = this.props.isOwner || this.props.isModerator;
        return moderators.map(mod => {
            return (
                <div key={mod._id} className="member">
                    <div className="member__name ellipsis">
                        {mod.displayName}
                    </div>
                    <div className="member__id">{mod._id}</div>
                    {haveAccess ? (
                        <div className="member__options">
                            {this.props.isOwner && this.props.isGroupTab ? (
                                <img
                                    className="member__options--arrow member__options--arrow-down"
                                    src="/images/up_arrow.svg"
                                    onClick={() =>
                                        this.handleModDowngrade(mod._id)
                                    }
                                />
                            ) : (
                                undefined
                            )}

                            {this.props.isOwner ? (
                                <img
                                    className="member__options--cross"
                                    src="/images/round_x.svg"
                                    onClick={() =>
                                        this.handleMemberRemove(mod._id)
                                    }
                                />
                            ) : (
                                undefined
                            )}
                        </div>
                    ) : (
                        undefined
                    )}
                </div>
            );
        });
    }

    renderMembers(members) {
        const haveAccess = this.props.isOwner || this.props.isModerator;

        return members.map(member => {
            return (
                <div key={member._id} className="member">
                    <div className="member__name ellipsis">
                        {member.displayName}
                    </div>
                    <div className="member__id">{member._id}</div>
                    {haveAccess ? (
                        <div className="member__options">
                            {this.props.isOwner && this.props.isGroupTab ? (
                                <img
                                    className="member__options--arrow"
                                    src="/images/up_arrow.svg"
                                    onClick={() =>
                                        this.handleMemberUpgrade(member._id)
                                    }
                                />
                            ) : (
                                <img
                                    className="member__options--arrow member__options--arrow-none"
                                    src="/images/up_arrow.svg"
                                />
                            )}

                            <img
                                className="member__options--cross"
                                src="/images/round_x.svg"
                                onClick={() =>
                                    this.handleMemberRemove(member._id)
                                }
                            />
                        </div>
                    ) : (
                        undefined
                    )}
                </div>
            );
        });
    }

    handleMemberRemove(memberId) {
        const removeMethod = this.props.isGroupTab
            ? "groupsMemberRemove"
            : "dsbjsAttendeeRemove";

        const leaveStatusMethod = this.props.isGroupTab
            ? "groupsMessagesStatus"
            : "dsbjsMessagesStatus";

        const itemId = this.props.selectedItemId;
        this.props.meteorCall(removeMethod, itemId, memberId, (err, res) => {
            if (err) {
                this.setState({ error: err.reason });
                setTimeout(() => this.setState({ error: "" }), 10000);
            } else {
                this.props.meteorCall(
                    leaveStatusMethod,
                    itemId,
                    "kick",
                    memberId
                );
            }
        });
    }

    handleMemberUpgrade(memberId) {
        if (!this.props.isGroupTab)
            throw new Meteor.Error("dsbj-no-moderators");

        this.props.meteorCall(
            "groupsModeratorAdd",
            this.props.selectedItemId,
            memberId,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                    setTimeout(() => this.setState({ error: "" }), 10000);
                }
            }
        );
    }

    handleModDowngrade(modId) {
        if (!this.props.isGroupTab)
            throw new Meteor.Error("dsbj-no-moderators");

        this.props.meteorCall(
            "groupsModeratorRemove",
            this.props.selectedItemId,
            modId,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                    setTimeout(() => this.setState({ error: "" }), 10000);
                }
            }
        );
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            error: ""
        });
    }
}

ManageMembersModal.propTypes = {
    isOwner: PropTypes.bool.isRequired,
    isModerator: PropTypes.bool.isRequired,
    isGroupTab: PropTypes.bool.isRequired,
    meteorCall: PropTypes.func.isRequired
};
