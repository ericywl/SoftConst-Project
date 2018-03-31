// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import ChatDropdown from "./_ChatDropdown";

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

                    <div className="chat-area__header-dots">
                        <ChatDropdown
                            isOwner={this.props.isOwner}
                            isModerator={this.props.isModerator}
                            selectedGroup={this.props.selectedGroup}
                            selectedTab={this.props.selectedTab}
                            meteorCall={this.props.meteorCall}
                            session={this.props.session}
                        />
                    </div>
                </div>
            );
        }

        return undefined;
    }
}

ChatAreaHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired,
    selectedGroup: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired
};

export default withTracker(() => {
    return {
        meteorCall: Meteor.call,
        session: Session
    };
})(ChatAreaHeader);
