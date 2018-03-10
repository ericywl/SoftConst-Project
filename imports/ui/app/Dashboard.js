import React from "react";

import PrivateHeader from "../auth/PrivateHeader";
import RoomList from "./RoomList";

export const Links = () => {
    return (
        <div>
            <PrivateHeader title="Notes" />
            <div className="page-content">
                <div className="page-content__sidebar">
                    <RoomList />
                </div>
                <div className="page-content__main">
                    <p>This is main</p>
                </div>
            </div>
        </div>
    );
};

export default Links;
