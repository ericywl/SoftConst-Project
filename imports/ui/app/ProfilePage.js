import React from "react";

import PrivateHeader from "./PrivateHeader";
import ProfileList from "./profile/ProfileList";
import ProfileArea from "./profile/ProfileArea";

export class ProfilePage extends React.Component {
    renderPage() {
        return (
            <div className="page-content">
                <div className="page-content__sidebar">
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

export default ProfilePage;
