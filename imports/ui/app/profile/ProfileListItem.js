// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class ProfileListItem extends React.Component {
    render() {
        const className = this.props.profile.selected
            ? "item item--selected"
            : "item";

        return (
            <div className={className} onClick={this.handleOnClick.bind(this)}>
                <h5 className="item__title ellipsis">
                    {this.props.profile.displayName}
                </h5>
                <p className="item__subtitle">
                    Joined {moment(this.props.profile.createdAt).fromNow()}
                </p>
            </div>
        );
    }

    handleOnClick(event) {
        event.preventDefault();
        this.props.session.set("selectedProfileId", this.props.profile._id);

        if (this.props.session.get("isNavOpen"))
            this.props.session.set("isNavOpen", false);
    }
}

ProfileListItem.propTypes = {
    profile: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const time = Session.get("sessionTime");
    return {
        session: Session
    };
})(ProfileListItem);
