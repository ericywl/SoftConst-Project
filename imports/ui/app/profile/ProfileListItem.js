// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class ProfileListItem extends React.Component {
    render() {
        const className = this.props.item.selected
            ? "item item--selected"
            : "item";

        return (
            <div className={className} onClick={this.handleOnClick.bind(this)}>
                <h5 className="item__title">{this.props.item.displayName}</h5>
                <p className="item__subtitle">
                    {moment(this.props.item.createdAt).fromNow()}
                </p>
            </div>
        );
    }

    handleOnClick(event) {
        event.preventDefault();

        this.props.session.set("selectedProfileId", this.props.item._id);
    }
}

ProfileListItem.propTypes = {
    item: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const time = Session.get("sessionTime");
    return {
        session: Session
    };
})(ProfileListItem);
