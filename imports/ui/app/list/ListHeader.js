// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import AddItemModal from "./_AddItemModal";
import JoinItemModal from "./_JoinItemModal";
import PrivateTab from "../PrivateTab";

// APIs
import { searchFilterBeforeSet } from "../../../misc/methods";

export class GroupListHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            tab: ""
        };

        this.groupsSearchBackup = "";
        this.dsbjsSearchBackup = "";
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.selectedTab !== this.props.selectedTab) {
            if (this.props.selectedTab === "groups") {
                this.groupsSearchBackup = this.state.search.trim();
            } else {
                this.dsbjsSearchBackup = this.state.search.trim();
            }
        }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        if (prevProps.selectedTab !== this.props.selectedTab) {
            const search =
                this.props.selectedTab === "groups"
                    ? this.groupsSearchBackup
                    : this.dsbjsSearchBackup;
            this.setState({ search });
        }

        this.props.session.set("searchQuery", this.state.search.trim());
    }

    render() {
        const selectedTab = this.props.selectedTab;
        const selectedItemId =
            selectedTab === "groups" ? "selectedGroupId" : "selectedDsbjId";
        const slicedTabText = selectedTab.slice(0, selectedTab.length - 1);

        return (
            <div className="item-list__header">
                <div className="tab-container__wrapper--mobile">
                    <div className="switch">
                        <label className="switch__box">
                            <input
                                ref="groupPrivate"
                                className="switch__input"
                                type="checkbox"
                                onClick={event => {
                                    if (event.target.checked) {
                                        this.props.session.set(
                                            "selectedTab",
                                            "DSBJs"
                                        );
                                    } else {
                                        this.props.session.set(
                                            "selectedTab",
                                            "groups"
                                        );
                                    }
                                }}
                            />
                            <span className="switch__slider">
                                <span>DSBJs</span>
                                <span>Groups</span>
                            </span>
                        </label>
                    </div>
                </div>
                <div className="item-list__buttons">
                    <button
                        className="button item-list__button--join"
                        onClick={() => {
                            this.joinModalChild.toggleModal();
                            this.setState({ search: "" });
                            this.props.session.set(selectedItemId, "");
                        }}
                    >
                        Join A {slicedTabText}
                    </button>
                    <button
                        className="button button--greyed item-list__button--create"
                        onClick={() => {
                            this.addModalChild.toggleModal();
                            this.setState({ search: "" });
                            this.props.session.set(selectedItemId, "");
                        }}
                    >
                        +
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

                <JoinItemModal
                    selectedTab={this.props.selectedTab}
                    session={this.props.session}
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
