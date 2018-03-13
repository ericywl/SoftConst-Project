import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

import MessageList from "./MessageList";
import ChatAreaFooter from "./ChatAreaFooter";
import AddTagModal from "./AddTagModal";
import { GroupsDB } from "../../../api/groups";

export class ChatArea extends React.Component {
    render() {
        if (!this.props.selectedGroupId) {
            return (
                <div>
                    <p>Select a group.</p>
                </div>
            );
        }

        const modalStyles = { overlay: { zIndex: 10 } };
        return (
            <div>
                <FlipMove maintainContainerHeight={true}>
                    <MessageList />
                </FlipMove>

                <div>
                    <ChatAreaFooter
                        selectedGroupId={this.props.selectedGroupId}
                    />
                </div>

                <div>
                    <button onClick={this.modalToggle.bind(this)}>
                        Manage group tags
                    </button>
                    <AddTagModal
                        ref={ref => {
                            this.child = ref;
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    return {
        selectedGroupId
    };
})(ChatArea);
