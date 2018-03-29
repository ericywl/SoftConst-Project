// Library
import React from "react";
import { Link } from "react-router-dom";
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
        return (
            <div className="page">
                <div className="tab-container__wrapper">
                    <div className="tab-container">
                        <ul>
                            <li className="tab">
                                <a
                                    href="#"
                                    className="tab__box"
                                    onClick={e => e.preventDefault()}
                                >
                                    Groups
                                </a>
                            </li>

                            <li className="tab">
                                <a
                                    href="#"
                                    className="tab__box"
                                    onClick={e => e.preventDefault()}
                                >
                                    DSBJs
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

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
