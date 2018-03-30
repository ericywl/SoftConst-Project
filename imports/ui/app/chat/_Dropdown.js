// Library
import React from "react";
import PropTypes from "prop-types";

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
                    {this.props.isModerator ? (
                        <div className="dropdown__item">Change Group Name</div>
                    ) : (
                        undefined
                    )}

                    <div
                        className="dropdown__item"
                        onClick={() => this.child.toggleModal()}
                    >
                        {this.props.isModerator
                            ? "Manage Group Tags"
                            : "View Group Tags"}
                    </div>

                    <div className="dropdown__item">Leave Group</div>
                </div>

                <ManageTagsModal
                    isModerator={this.props.isModerator}
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
}

export default ChatDropdown;
