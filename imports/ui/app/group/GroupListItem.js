import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class GroupListItem extends React.Component {
    render() {
        const className = this.props.group.selected
            ? "item item--selected"
            : "item";

        return (
            <div
                className={className}
                onClick={() => {
                    this.props.session.set(
                        "selectedGroupId",
                        this.props.group._id
                    );
                }}
            >
                <h5 className="item__title">{this.props.group.name}</h5>
                <p className="item__subtitle">
                    {moment(this.props.group.lastMessageAt).fromNow()}
                </p>
            </div>
        );
    }
}

GroupListItem.propTypes = {
    group: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {
        session: Session
    };
})(GroupListItem);
