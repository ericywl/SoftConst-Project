import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import FlipMove from "react-flip-move";
import { withTracker } from "meteor/react-meteor-data";

import MessageList from "./MessageList";
import ChatAreaFooter from "./ChatAreaFooter";
import { GroupsDB } from "../../../api/groups";

let GroupTagsDB = new Mongo.Collection("groupTags");

export class ChatArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
    }

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
                    <MessageList selectedGroupId={this.props.selectedGroupId} />
                </FlipMove>

                <div>
                    <ChatAreaFooter
                        selectedGroupId={this.props.selectedGroupId}
                    />
                </div>

                <button onClick={this.modalToggle.bind(this)}>
                    Manage group tags
                </button>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Create New Group"
                    onAfterOpen={() => {}}
                    onRequestClose={this.modalToggle.bind(this)}
                    className="boxed-view__large-box"
                    overlayClassName="boxed-view boxed-view--modal"
                    shouldReturnFocusAfterClose={false}
                    style={modalStyles}
                >
                    <div>
                        {this.renderTags()}
                        <form onSubmit={this.onSubmit.bind(this)}>
                            <input type="text" />
                            <button>Add tags</button>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }

    renderTags() {
        return this.props.groupTags.map(tag => <p>{tag}</p>);
    }

    onSubmit(event) {
        event.preventDefault();
        console.log(event.target);
    }

    modalToggle() {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groupTags", selectedGroupId);

    const groupTags = GroupTagsDB.find().fetch();
    return {
        selectedGroupId,
        groupTags
    };
})(ChatArea);
