import React from "react";
import {Modal} from "react-modal";

import PrivateHeader from "../auth/PrivateHeader";
import GroupList from "./group/GroupList";
import ChatArea from "./chat/ChatArea";

export class Dashboard extends React.Component {
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

export default Dashboard;
