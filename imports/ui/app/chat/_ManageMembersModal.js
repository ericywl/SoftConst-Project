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
        const moderators = [];
        const members = [];

        this.props.members.map(member => {
            if (this.props.moderatorIds.includes(member._id)) {
                moderators.push(member);
            } else {
                members.push(member);
            }
        });

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
                    Manage Members
                </h2>
                <div className="members__list">
                    {this.renderMembers(members)}
                </div>
            </Modal>
        );
    }

    renderMembers(members) {
        if (members.length === 0) {
            return (
                <div className="empty-members">
                    There are no members currently.
                </div>
            );
        }

        return members.map(member => {
            return (
                <div key={member._id} className="member">
                    <div className="member__name ellipsis">
                        {member.displayName}
                    </div>
                    <div className="member__id">{member._id}</div>
                    <div className="member__options">
                        <img
                            className="member__options--cross"
                            src="/images/round_x.svg"
                            //onClick={this.handleTagDelete.bind(this)}
                        />
                        <img
                            className="member__options--cross"
                            src="/images/round_x.svg"
                            onClick={() => this.handleMemberRemove(member._id)}
                        />
                    </div>
                </div>
            );
        });
    }

    handleMemberRemove(memberId) {
        this.props.meteorCall(
            "groupsMemberRemove",
            this.props.selectedItemId,
            memberId
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
