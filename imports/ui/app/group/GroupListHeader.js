import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class GroupListHeader extends React.Component {
    render() {
        return (
            <div>
                <button
                    className="button"
                    onClick={() => {
                        this.props.meteorCall("groupsInsert", (err, res) => {
                            // call back to set session etc.
                        });
                    }}
                >
                    Create group
                </button>
            </div>
        );
    }
}

GroupListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {
        meteorCall: Meteor.call,
        session: Session
    };
})(GroupListHeader);
