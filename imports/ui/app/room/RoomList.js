import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

import { RoomsDB } from "../../../api/rooms";
import RoomListHeader from "./RoomListHeader";
import RoomListItem from "./RoomListItem";

export class RoomList extends React.Component {
    renderRoomList() {
        return this.props.rooms.map(room => {
            return <RoomListItem key={room._id} room={room} />;
        });
    }

    render() {
        return (
            <div className="item-list">
                <RoomListHeader />
                <FlipMove maintainContainerHeight="true">
                    {this.renderRoomList()}
                </FlipMove>
            </div>
        );
    }
}

RoomList.propTypes = {
    rooms: PropTypes.array.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedRoomId = Session.get("selectedRoomId");
    Meteor.subscribe("roomsDB");

    return {
        rooms: RoomsDB.find({}, { sort: { lastMessageAt: -1 } })
            .fetch()
            .map(room => {
                return {
                    ...room,
                    selected: room._id === selectedRoomId
                };
            }),
        session: Session
    };
})(RoomList);
