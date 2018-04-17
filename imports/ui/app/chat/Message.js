// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

export class Message extends React.Component {
    render() {
        const userDisplayName = this.props.message.userDisplayName;
        const messageSentAt = moment(this.props.message.sentAt).calendar();
        const modalClass = this.props.removeMessage ? "" : " message--modal";

        const isSender = this.props.message.userId === Meteor.userId();
        const canRemoveMsg = isSender || this.props.isAuth;

        return (
            <div className={"message" + modalClass}>
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

                    {this.props.removeMessage && canRemoveMsg ? (
                        <div className="message__body-option">
                            <img
                                className="message__body-option-del"
                                src="/images/close_x.svg"
                                onClick={this.handleOnClick.bind(this)}
                            />
                        </div>
                    ) : (
                        undefined
                    )}
                </div>
            </div>
        );
    }

    handleOnClick(event) {
        event.preventDefault();
        this.props.removeMessage(this.props.message);
    }
}

Message.propTypes = {
    message: PropTypes.object.isRequired
};

export default Message;
