// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import AddItemModal from "../list/_AddItemModal";
import JoinItemModal from "../list/_JoinItemModal";

// APIs
import { searchFilterBeforeSet } from "../../../misc/methods";

export class ProfileListHeader extends React.Component {
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
                        Add A Friend
                    </button>
                </div>

                <AddItemModal
                    selectedTab={this.props.selectedTab}
                    session={this.props.session}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.addModalChild = ref;
                    }}
                />

                <input
                    type="search"
                    value={this.state.search}
                    placeholder={"Search for profiles"}
                    onChange={this.handleSearchChange.bind(this)}
                />
            </div>
        );
    }
    /*
<button
                        className="button button--greyed item-list__button--create"
                        onClick={() => this.addModalChild.toggleModal()}
                    >
                        +
                    </button>

        <JoinItemModal
                    selectedTab={this.props.selectedTab}
                    session={this.props.session}
                    meteorCall={this.props.meteorCall}
                    ref={ref => {
                        this.joinModalChild = ref;
                    }}
                />
    */

    handleSearchChange(event) {
        let newSearch = event.target.value;
        if (newSearch[0] === "#") {
            newSearch = newSearch.trim();
        } else if (newSearch[0] === "@") {
            newSearch = newSearch.trim();
        } else if (newSearch.slice(-1) === "#") return;
        this.setState({ search: newSearch });
        this.props.session.set("searchQuery", newSearch);
    }
}

ProfileListHeader.propTypes = {
    meteorCall: PropTypes.func.isRequired,
    session: PropTypes.object.isRequired
};

export default withTracker(() => {
    return {
        meteorCall: Meteor.call,
        session: Session
    };
})(ProfileListHeader);