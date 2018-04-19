import React from "react";

import PrivateHeader from "./PrivateHeader";
import ProfileList from "./profile/ProfileList";
import ProfileArea from "./profile/ProfileArea";

export class DashboardProfile extends React.Component {
    renderPage() {
        const profileId = this.props.match.params.id;

        return (
            <div className="page-content page-content--notab">
                <div className="page-content__sidebar page-content__sidebar--noroombar">
                    <ProfileList profileId={profileId} />
                </div>

                <div className="page-content__main">
                    <ProfileArea profileId={profileId} />
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
