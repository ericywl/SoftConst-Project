// Library
import React from "react";
import Modal from "react-modal";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import PrivateHeader2 from "./PrivateHeader2";
import List from "./list/List";
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
                        <div>dummy</div>
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
                <PrivateHeader2 title="STUD Chat" />
                {this.renderPage()}
            </div>
        );
    }
}

export default ProfilePage;
