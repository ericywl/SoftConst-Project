import React from "react";

import PrivateHeader from "../auth/PrivateHeader";
import RoomList from "./room/RoomList";
import ChatArea from "./chat/ChatArea";

export const Links = () => {
    return (
        <div>
            <PrivateHeader title="Notes" />
            <div className="page-content">
                <div className="page-content__sidebar">
                    <RoomList />
                </div>
                <div className="page-content__main">
                    <ChatArea />
                </div>
            </div>
        </div>
    );
};

export default Links;
