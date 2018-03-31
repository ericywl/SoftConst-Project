// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// API
import { capitalizeFirstLetter } from "../../../misc/methods";
import { ROOM_TEXT_ARR } from "../../../misc/constants";

export class GroupListRoomBar extends React.Component {
    constructor(props) {
        super(props);
        this.selectedRooms = {};
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const sessionSelectedRoom = this.props.selectedRoom;
        const currGroupId = this.props.selectedGroupId;
        const nextGroupId = nextProps.selectedGroupId;
        if (currGroupId !== nextGroupId) {
            this.selectedRooms[currGroupId] = sessionSelectedRoom;
            const room = this.selectedRooms[nextGroupId];
            if (ROOM_TEXT_ARR.includes(room)) {
                this.props.session.set("selectedRoom", room);
            }
        }
    }

    render() {
        return (
            <div className="room-bar">
                <div ref="sidebarContent" className="room-bar__content">
                    {this.renderButtons()}
                </div>
            </div>
        );
    }

    renderButtons() {
        const isDisabled = !this.props.selectedGroupId || this.props.notInGroup;

        return ROOM_TEXT_ARR.map(text => {
            let selected = "";
            if (this.props.selectedRoom === text) {
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
        event.preventDefault();
        const name = event.target.getAttribute("name");

        if (this.props.selectedRoom !== name) {
            Array.from(this.refs.sidebarContent.children).forEach(child => {
                child.classList.remove("button--room-bar-selected");
            });

            event.target.classList.add("button--room-bar-selected");
            this.props.session.set("selectedRoom", name);
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
    const selectedRoom = Session.get("selectedRoom");

    return {
        selectedGroupId,
        selectedRoom,
        session: Session
    };
})(GroupListRoomBar);
