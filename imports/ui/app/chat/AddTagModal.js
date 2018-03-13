import React from "react-modal";

export class AddTagModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            newTag: "",
            error: ""
        };
    }

    render() {
        return (
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
                <div className="boxed-view__form">
                    <div className="tags">{this.renderTags()}</div>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input
                            ref="newTag"
                            name="newTag"
                            type="text"
                            value={this.state.newTag}
                            onChange={this.handleTagChange.bind(this)}
                        />
                        <button className="button button--tag">Add tags</button>
                    </form>
                </div>
            </Modal>
        );
    }

    renderTags() {
        return this.props.groupTags.map((tag, index) => (
            <span
                style={{ float: "left", padding: "0 0.5rem" }}
                key={`tag${index}`}
            >
                #{tag}
            </span>
        ));
    }

    handleTagChange(event) {
        event.preventDefault();
        this.setState({ newTag: event.target.value.trim() });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.meteorCall(
            "groupsAddTag",
            this.props.selectedGroupId,
            this.state.newTag,
            (err, res) => {
                if (err) {
                    this.setState({ error: err.reason });
                }
            }
        );

        this.setState({ newTag: "" });
    }

    modalToggle() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            newTag: "",
            error: ""
        });
    }
}

export default withTracker(() => {
    const selectedGroupId = Session.get("selectedGroupId");
    Meteor.subscribe("groupTags", selectedGroupId);

    const group = GroupsDB.findOne();
    const groupTags = group && group.tags ? group.tags : [];

    return {
        groupTags,
        meteorCall: Meteor.call
    };
})(AddTagModal);
