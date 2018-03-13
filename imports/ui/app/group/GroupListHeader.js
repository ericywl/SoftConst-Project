import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import GroupAddModal from "./GroupAddModal";

export class GroupListHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="item-list__header">
                <button
                    className="button"
                    onClick={() => this.child.modalToggle()}
                >
                    Create group
                </button>

                <GroupAddModal
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.child = ref;
                    }}
                />

                <input type="search" />
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
