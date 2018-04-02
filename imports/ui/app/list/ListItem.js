// Library
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";

export class ListItem extends React.Component {
    render() {
        const className = this.props.item.selected
            ? "item item--selected"
            : "item";

        return (
            <div className={className} onClick={this.handleOnClick.bind(this)}>
                <h5 className="item__title">{this.props.item.name}</h5>
                <p className="item__subtitle">
                    {moment(this.props.item.lastMessageAt).fromNow()}
                </p>
            </div>
        );
    }

    handleOnClick(event) {
        event.preventDefault();
        const sessionStr =
            this.props.selectedTab === "groups"
                ? "selectedGroupId"
                : "selectedDsbjId";

        this.props.session.set(sessionStr, this.props.item._id);
    }
}

ListItem.propTypes = {
    item: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    const time = Session.get("sessionTime");
    return {
        session: Session
    };
})(ListItem);
