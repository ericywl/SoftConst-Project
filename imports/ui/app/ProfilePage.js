// Library
import React from "react";
import Modal from "react-modal";
import { withTracker } from "meteor/react-meteor-data";

<<<<<<< HEAD

// React Components
import PrivateHeader2 from "./PrivateHeader2";
import GroupList from "./group/GroupList";
=======
// React Components
import PrivateHeader2 from "./PrivateHeader2";
import List from "./list/List";
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
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
<<<<<<< HEAD
                        <GroupList />
=======
                        <div>dummy</div>
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
                    </div>

                    <div className="page-content__main">
                        <ProfileArea />
                    </div>
                </div>
            );
<<<<<<< HEAD
        } 
=======
        }
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
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

<<<<<<< HEAD
export default ProfilePage;
=======
export default ProfilePage;
>>>>>>> 501bb88799a220b646f3b5b2390ddaf4509d6fb2
