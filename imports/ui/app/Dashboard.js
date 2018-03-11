import React from "react";

import PrivateHeader from "../auth/PrivateHeader";
import GroupList from "./group/GroupList";
import ChatArea from "./chat/ChatArea";

export const Links = () => {
    return (
        <div>
            <PrivateHeader title="STUD Chat" />
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
};

export default Links;
