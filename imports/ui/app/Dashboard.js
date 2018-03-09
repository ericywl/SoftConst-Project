import React from "react";

import PrivateHeader from "../auth/PrivateHeader";
import NoteList from "./NoteList";
import Editor from "./Editor";

const Links = () => {
    return (
        <div>
            <PrivateHeader title="Dashboard" />
            <div className="page-content">
                <NoteList />
                <Editor />
            </div>
        </div>
    );
};

export default Links;
