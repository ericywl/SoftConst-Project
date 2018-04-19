// Library
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { DashboardProfile } from "../ui/app/DashboardProfile";

const PrivateRoute = ({ component: Component, isAuth, path, ...rest }) => {
    const renderFunc = props => {
        // check if user is trying to access page that requires auth;
        if (!isAuth) {
            return (
                <Redirect
                    to={{ pathname: "/", state: { from: props.location } }}
                />
            );
        }

        if (path === "/profile") {
            const path = "/profile/" + Meteor.userId();
            return (
                <Redirect
                    to={{ pathname: path, state: { from: props.location } }}
                />
            );
        }

        return <Component {...props} />;
    };

    return <Route {...rest} render={renderFunc} />;
};

export default PrivateRoute;
