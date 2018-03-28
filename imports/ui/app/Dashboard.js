// Library
import React from "react";
import { withTracker } from "meteor/react-meteor-data";

// React Components
import PrivateHeader from "./PrivateHeader";
import GroupList from "./group/GroupList";
import ChatArea from "./chat/ChatArea";

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "chat"
        };
    }

    renderPage() {
        if (this.state.page === "chat") {
            return (
                <div>
                    <div>Hi</div>

                    <div className="page-content">
                        <div className="page-content__sidebar">
                            <GroupList />
                        </div>

                        <div className="page-content__main">
                            <ChatArea />
                        </div>
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

export default Dashboard;
