// Library
import React from "react";
import Modal from "react-modal";
import { withTracker } from "meteor/react-meteor-data";


// React Components
<<<<<<< HEAD
import PrivateHeader2 from "./PrivateHeader2";
import GroupList from "./group/GroupList";
=======
import PrivateHeader from "./PrivateHeader";
import PrivateTab from "./PrivateTab";
import List from "./list/List";
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
import ChatArea from "./chat/ChatArea";

export class Dashboard extends React.Component {
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
                : " page-content__sidebar--dsbj";

        const mainClass =
            this.props.selectedTab === "groups"
                ? ""
                : " page-content__main--dsbj";

        return (
            <div className="page-content">
                <div className={"page-content__sidebar" + sidebarClass}>
                    <List selectedTab={this.props.selectedTab} />
                </div>
<<<<<<< HEAD
            );
        } 
=======

                <div className={"page-content__main" + mainClass}>
                    <ChatArea selectedTab={this.props.selectedTab} />
                </div>
            </div>
        );
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
    }

    render() {
        return (
            <div>
<<<<<<< HEAD
                <PrivateHeader2 title="STUD Chat" />
=======
                <PrivateHeader title="STUD Chat" />
                <PrivateTab />
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
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
})(Dashboard);
