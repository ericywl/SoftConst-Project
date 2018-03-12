import React from "react";
<<<<<<< HEAD
import {Modal} from "react-modal";
=======
import { Modal } from "react-modal";
>>>>>>> f7424aa39e28ea40d8629ff89247decc2a51e30f

import PrivateHeader from "../auth/PrivateHeader";
import GroupList from "./group/GroupList";
import ChatArea from "./chat/ChatArea";

export class Dashboard extends React.Component {
<<<<<<< HEAD
	constructor(props) {
		super(props);
		this.state = {
			page: "chat" // chat, profile, finder
		}
	}
	
	renderPage() {
		switch(this.state.page){
			case "chat":
				return (
					<div className="page-content">
					    <div className="page-content__sidebar">
					        <GroupList />
					    </div>

					    <div className="page-content__main">
					        <ChatArea />
					    </div>
					</div>
				);	
			case "finder":
				/*return (
					<div className="page-content">
					    <div className="page-content__sidebar">
					        <GroupList />
					    </div>

					    <div className="page-content__main">
					        <ChatArea />
					    </div>
					</div>
				);*/
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
};
=======
    constructor(props) {
        super(props);
        this.state = {
            page: "chat"
        };
    }

    renderPage() {
        if (this.state.page === "chat") {
            return (
                <div className="page-content">
                    <div className="page-content__sidebar">
                        <GroupList />
                    </div>

                    <div className="page-content__main">
                        <ChatArea />
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
>>>>>>> f7424aa39e28ea40d8629ff89247decc2a51e30f

export default Dashboard;
