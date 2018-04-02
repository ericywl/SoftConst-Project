// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

export class Message extends React.Component {
    render() {
        const userDisplayName = this.props.message.userDisplayName;
        const messageSentAt = moment(this.props.message.sentAt).calendar();

        return (
            <div className="message">
                <div className="message__header">
                    <span className="message__header-username">
                        {userDisplayName}
                    </span>{" "}
                    <span className="message__header-time">
                        {messageSentAt}
                    </span>
                </div>

                <div className="message__body">
                    <div className="message__body-content">
                        {this.props.message.content}
                    </div>

                    <div className="message__body-option">
                        <button>Hi</button>
                    </div>
                </div>
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object.isRequired
};

export default Message;
