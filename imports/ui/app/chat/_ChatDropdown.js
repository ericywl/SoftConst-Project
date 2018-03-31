// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// React Components
import ManageTagsModal from "./_ManageTagsModal";

export class ChatDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownIsOpen: false
        };
    }

    render() {
        const haveAccess = this.props.isModerator || this.props.isOwner;

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
                        <div className="dropdown__item">Change Group Name</div>
                    ) : (
                        undefined
                    )}

                    <div
                        className="dropdown__item"
                        onClick={() => this.child.toggleModal()}
                    >
                        {haveAccess ? "Manage Group Tags" : "View Group Tags"}
                    </div>

                    {this.props.isOwner ? (
                        <div className="dropdown__item dropdown__item--disabled">
                            Leave Group
                        </div>
                    ) : (
                        <div
                            className="dropdown__item"
                            onClick={this.handleLeaveOnClick.bind(this)}
                        >
                            Leave Group
                        </div>
                    )}
                </div>

                <ManageTagsModal
                    haveAccess={this.props.isModerator || this.props.isOwner}
                    selectedGroup={this.props.selectedGroup}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.child = ref;
                    }}
                />
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
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ dropdownIsOpen: false });
        }
    }

    handleLeaveOnClick(event) {
        if (this.props.isOwner) {
            throw new Meteor.Error("owner-cannot-leave-group");
        }

        this.props.meteorCall(
            "profilesLeaveGroup",
            this.props.selectedGroup._id
        );

        this.props.session.set("selectedGroupId", "");
        this.props.session.set("sessionTime", moment().valueOf());
    }
}

export default ChatDropdown;
