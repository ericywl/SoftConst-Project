import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

export class Message extends React.Component {
    render() {
        const userName = this.props.message.userName;
        const messageSentAt = moment(this.props.message.sentAt).calendar();

        return (
            <div>
                <p>
                    {userName} ({messageSentAt}) - {this.props.message.content}
                </p>
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {};
})(Message);
