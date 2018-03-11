import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class RoomListHeader extends React.Component {
    render() {
        return (
            <div>
                <button
                    className="button"
                    onClick={() => {
                        this.props.meteorCall("roomsInsert", (err, res) => {
                            // call back to set session etc.
                        });
                    }}
                >
                    Create room
                </button>
            </div>
        );
    }
}

RoomListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {
        meteorCall: Meteor.call,
        session: Session
    };
})(RoomListHeader);
