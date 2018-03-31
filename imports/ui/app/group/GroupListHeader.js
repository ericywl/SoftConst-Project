// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import AddGroupModal from "./_AddGroupModal";
import JoinGroupModal from "./_JoinGroupModal";

// APIs
import { searchFilterBeforeSet } from "../../../misc/methods";

export class GroupListHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        if (prevProps.selectedTab !== this.props.selectedTab) {
            this.setState({ search: "" });
        }
    }

    render() {
        const selectedTab = this.props.selectedTab;
        const slicedTabText = selectedTab.slice(0, selectedTab.length - 1);

        return (
            <div className="item-list__header">
                <div className="item-list__buttons">
                    <button
                        className="button item-list__button--join"
                        onClick={() => this.joinModalChild.toggleModal()}
                    >
                        Join {slicedTabText}
                    </button>
                    <button
                        className="button button--greyed item-list__button--create"
                        onClick={() => this.addModalChild.toggleModal()}
                    >
                        +
                    </button>
                </div>

                <AddGroupModal
                    selectedTab={this.props.selectedTab}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.addModalChild = ref;
                    }}
                />

                <JoinGroupModal
                    selectedTab={this.props.selectedTab}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.joinModalChild = ref;
                    }}
                />

                <input
                    type="search"
                    value={this.state.search}
                    placeholder={"Search for " + selectedTab}
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
