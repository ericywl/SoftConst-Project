// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import MessageList from "./MessageList";

export class ChatAreaBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    }

    render() {
        const tabText = this.props.selectedTab.slice(
            0,
            this.props.selectedTab.length - 1
        );

        return (
            <div className="chat-area__body">
                {this.state.error ? <p>{this.state.error}</p> : undefined}

                {this.props.notInItem ? (
                    <div className="chat-area__body--not-joined">
                        <h2 className="chat-area__body-desc">
                            {this.props.selectedItem.description}
                        </h2>

                        {this.props.selectedTab === "dsbjs" ? (
                            <div>time</div>
                        ) : (
                            undefined
                        )}

                        <div className="chat-area__body-tags">
                            {this.renderTags(tabText)}
                        </div>

                        <button
                            className="button"
                            onClick={this.onClickJoin.bind(this)}
                        >
                            Join {tabText}
                        </button>
                    </div>
                ) : (
                    <MessageList
                        isOwner={this.props.isOwner}
                        isModerator={this.props.isModerator}
                    />
                )}
            </div>
        );
    }

    renderTags(tabText) {
        if (this.props.selectedItem.tags.length === 0) {
            return (
                <div className="empty-tags">
                    This {tabText} does not have any tags.
                </div>
            );
        }

        return this.props.selectedItem.tags.map((tag, index) => (
            <span className="tags__tag" key={`tag${index}`}>
                <span className="tags__tag--hash"># </span>
                <span>{tag}</span>
            </span>
        ));
    }

    onClickJoin(event) {
        event.preventDefault();
        const isGroupTab = this.props.selectedTab === "groups";

        const joinMethod = isGroupTab
            ? "profilesJoinGroup"
            : "profilesJoinDsbj";

        const welcomeMethod = isGroupTab
            ? "groupsMessagesWelcome"
            : "dsbjsMessagesWelcome";

        this.props.meteorCall(
            joinMethod,
            this.props.selectedItem._id,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                    setTimeout(() => this.setState({ error: "" }), 10000);
                } else {
                    this.props.meteorCall(
                        welcomeMethod,
                        this.props.selectedItem._id
                    );
                }
            }
        );
    }
}

ChatAreaBody.propTypes = {
    selectedItem: PropTypes.object.isRequired,
    selectedTab: PropTypes.string.isRequired,
    notInItem: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    isModerator: PropTypes.bool.isRequired,
    meteorCall: PropTypes.func.isRequired
};

export default withTracker(() => {
    return { meteorCall: Meteor.call };
})(ChatAreaBody);
