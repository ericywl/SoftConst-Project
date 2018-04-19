// Library
import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import PrivateHeader from "./PrivateHeader";
import PrivateTab from "./PrivateTab";
import List from "./list/List";
import ChatArea from "./chat/ChatArea";

export class DashboardChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "chat"
        };
    }

    renderPage() {
        const sidebarClass =
            this.props.selectedTab === "groups"
                ? ""
                : " page-content__sidebar--noroombar";

        const mainClass =
            this.props.selectedTab === "groups"
                ? ""
                : " page-content__main--dsbj";

        return (
            <div className="page-content">
                <div className={"page-content__sidebar" + sidebarClass}>
                    <List selectedTab={this.props.selectedTab} />
                </div>

                <div className={"page-content__main" + mainClass}>
                    <ChatArea selectedTab={this.props.selectedTab} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <PrivateHeader title="STUD Chat" />
                <PrivateTab />
                {this.renderPage()}
            </div>
        );
    }
}

export default withTracker(() => {
    const selectedTab = Session.get("selectedTab");

    return {
        selectedTab
    };
})(DashboardChat);
