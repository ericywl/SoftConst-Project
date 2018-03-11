import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

export class Message extends React.Component {
    render() {
        return (
            <div>
                <p>
                    {this.props.message.senderId} - {this.props.message.content}
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
