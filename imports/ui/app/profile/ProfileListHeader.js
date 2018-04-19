// Library
import React from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import AddItemModal from "../list/_AddItemModal";
import JoinItemModal from "../list/_JoinItemModal";

// APIs
import { searchProfileFilterBeforeSet } from "../../../misc/methods";

export class ProfileListHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }

    componentDidMount() {
        this.props.session.set("profileQuery", "");
    }

    componentWillUnmount() {
        this.props.session.set("profileQuery", "");
    }

    render() {
        return (
            <div className="item-list__header">
                <div className="item-list__title">
                    People that you might be interested in
                </div>

                <input
                    type="search"
                    value={this.state.search}
                    placeholder={"Search for profiles"}
                    onChange={this.handleSearchChange.bind(this)}
                    style={{ marginBottom: "0" }}
                />
            </div>
        );
    }

    handleSearchChange(event) {
        let newSearch = searchProfileFilterBeforeSet(event.target.value);
        const substr = newSearch.substring(1);

        if (newSearch[0] === "#" || newSearch[0] === "@") {
            if (
                substr.includes("#") ||
                substr.includes("@") ||
                substr.includes(" ")
            )
                return;

            newSearch = newSearch.trim();
        } else if (newSearch !== "") {
            return;
        }

        this.setState({ search: newSearch });
        this.props.session.set("profileQuery", newSearch);
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
