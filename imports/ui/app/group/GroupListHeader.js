// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import AddGroupModal from "./_AddGroupModal";

// APIs
import { searchFilterBeforeSet } from "../../../misc/methods";

export class GroupListHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }

    render() {
        return (
            <div className="item-list__header">
                <button
                    className="button"
                    onClick={() => this.modalChild.toggleModal()}
                >
                    Create group
                </button>

                <AddGroupModal
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.modalChild = ref;
                    }}
                />

                <input
                    type="search"
                    value={this.state.search}
                    placeholder="Search for groups"
                    onChange={this.handleSearchChange.bind(this)}
                />
            </div>
        );
    }

    handleSearchChange(event) {
        let newSearch = searchFilterBeforeSet(event.target.value);
        if (newSearch[0] === "#") {
            newSearch = newSearch.trim();
        } else if (newSearch.slice(-1) === "#") return;

        this.setState({ search: newSearch });
        this.props.session.set("searchQuery", newSearch);
    }
}

GroupListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {
        meteorCall: Meteor.call,
        session: Session
    };
})(GroupListHeader);
