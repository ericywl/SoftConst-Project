import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class RoomListItem extends React.Component {
    render() {
        const className = this.props.room.selected
            ? "item item--selected"
            : "item";

        return (
            <div
                className={className}
                onClick={() => {
                    this.props.session.set(
                        "selectedRoomId",
                        this.props.room._id
                    );
                }}
            >
                <h5 className="item__title">{this.props.room.name}</h5>
                <p className="item__subtitle">
                    {moment(this.props.room.lastMessageAt).fromNow()}
                </p>
            </div>
        );
    }
}

RoomListItem.propTypes = {
    room: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {
        session: Session
    };
})(RoomListItem);
