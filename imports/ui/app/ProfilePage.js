import React from "react";

import ProfileArea from "./profile/ProfileArea";
import PrivateHeader from "./PrivateHeader";

export class ProfilePage extends React.Component {
    renderPage() {
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
