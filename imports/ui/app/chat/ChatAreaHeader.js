// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import Dropdown from "./_Dropdown";

// APIs
import { GroupsDB } from "../../../api/groups";

export class ChatAreaHeader extends React.Component {
    render() {
        const options = ["one", "two", "bignummsdfsdnkw"];
        const defaultOption = options[0];

        if (this.props.selectedGroup) {
            return (
                <div className="chat-area__header">
                    <h1 className="chat-area__header-title">
                        {this.props.selectedGroup.name}
                    </h1>

                    <Dropdown
                        isModerator={this.props.isModerator}
                        selectedGroup={this.props.selectedGroup}
                        meteorCall={this.props.meteorCall}
                    />
                </div>
            );
        }

        return undefined;
    }
}

ChatAreaHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    selectedGroup: PropTypes.object.isRequired
};

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");

    return {
        meteorCall: Meteor.call
    };
})(ChatAreaHeader);
