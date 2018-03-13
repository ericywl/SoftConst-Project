import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

import AddGroupModal from "./_AddGroupModal";
import { searchStrip } from "../../../methods/methods";

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
                    onClick={() => this.child.toggleModal()}
                >
                    Create group
                </button>

                <AddGroupModal
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.child = ref;
                    }}
                />

                <input
                    type="search"
                    placeholder="Search for groups"
                    onChange={this.handleSearchChange.bind(this)}
                />
            </div>
        );
    }

    handleSearchChange(event) {
        const search = searchStrip(event.target.value);

        this.setState({ search });
        this.props.session.set("searchQuery", search);
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
