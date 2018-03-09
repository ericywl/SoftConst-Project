import React from "react";

import PrivateHeader from "./PrivateHeader";

const Links = () => {
    return (
        <div>
            <PrivateHeader title="Dashboard" />
            <div className="page-content">This is dashboard.</div>
        </div>
    );
};

export default Links;
