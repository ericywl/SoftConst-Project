import React from "react";
import { Accounts } from "meteor/accounts-base";

import PrivateHeader from "./PrivateHeader";

const Links = () => {
    return (
        <div>
            <PrivateHeader title="Dashboard" />
            <div className="page-content">Dashboard page content.</div>
        </div>
    );
};

export default Links;
