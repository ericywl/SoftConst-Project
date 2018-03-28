// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// API
import { capitalizeFirstLetter } from "../../../misc/methods";
import { BUTTON_TEXT_ARR } from "../../../misc/constants";

export class GroupListRoomBar extends React.Component {
    render() {
        return (
            <div className="room-bar">
                <div
                    ref="sidebarContent"
                    className="room-bar__content"
                >
                    {this.renderButtons()}
                </div>
            </div>
        );
    }

    renderButtons() {
        const isDisabled = !this.props.selectedGroupId || this.props.notInGroup;

        return BUTTON_TEXT_ARR.map(text => {
            let selected = "";
            if (this.props.session.get("selectedRoom") === text) {
                selected = " button--room-bar-selected";
            }

            return (
                <button
                    key={text}
                    name={text}
                    className={"button--room-bar" + selected}
                    disabled={isDisabled}
                    onClick={this.handleOnClick.bind(this)}
                >
                    {capitalizeFirstLetter(text)}
                </button>
            );
        });
    }

    handleOnClick(event) {
        if (this.props.session.get("selectedRoom") !== event.target.name) {
            Array.from(this.refs.sidebarContent.children).forEach(child => {
                child.classList.remove("button--room-bar-selected");
            });

            event.target.classList.add("button--room-bar-selected");
            this.props.session.set("selectedRoom", event.target.name);
            this.props.session.set("isNavOpen", false);
        }
    }
}

GroupListRoomBar.propTypes = {
    selectedGroupId: PropTypes.string.isRequired,
    session: PropTypes.object.isRequired,
    notInGroup: PropTypes.bool.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Session.set("selectedRoom", "messages");

    return {
        selectedGroupId,
        session: Session
    };
})(GroupListRoomBar);
