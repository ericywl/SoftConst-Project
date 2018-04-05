// Library
import React from "react";
import Modal from "react-modal";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import PrivateHeader from "./PrivateHeader";
import PrivateTab from "./PrivateTab";
import ProfileList from "./profile/ProfileList";
import ChatArea from "./chat/ChatArea";
import ProfileArea from "./profile/ProfileArea";

export class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "profile"
        };
    }

    renderPage() {
        if (this.state.page === "profile") {
            return (
                <div className="page-content">
                    <div className="page-content__sidebar">
                        <ProfileList selectedTab = {this.props.selectedTab} />
                    </div>

                    <div className="page-content__main">
                        <ProfileArea />
                    </div>
                </div>
            );
        } 
    }

    render() {
        return (
            <div>
                <PrivateHeader title="STUD Chat" />
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
})(ProfilePage);
