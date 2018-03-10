import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import FlipMove from "react-flip-move";

import { RoomsDB } from "../../api/rooms";
import RoomListHeader from "./RoomListHeader";

export class RoomList extends React.Component {
    renderRoomList() {
        return this.props.rooms.map(room => {
            return (
                <div key={room._id} className="item">
                    <h5>{room.name}</h5>
                    <p>{room.lastMessageAt}</p>
                </div>
            );
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
    rooms: PropTypes.array.isRequired
};

export default withTracker(() => {
    Meteor.subscribe("roomsDB");

    return {
        rooms: RoomsDB.find({}, { sort: { lastMessageAt: -1 } }).fetch()
    };
})(RoomList);
