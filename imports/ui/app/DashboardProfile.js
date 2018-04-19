// Library
import React from "react";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import PrivateHeader from "./PrivateHeader";
import ProfileList from "./profile/ProfileList";
import ProfileArea from "./profile/ProfileArea";

export class DashboardProfile extends React.Component {
    renderPage() {
        return (
            <div className="page-content page-content--notab">
                <div className="page-content__sidebar page-content__sidebar--noroombar">
                    <ProfileList />
                </div>

                <div className="page-content__main">
                    <ProfileArea />
                </div>
            </div>
        );
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

export default DashboardProfile;
