import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuth, ...rest }) => {
    const renderFunc = props => {
        // check if user is trying to access page that requires auth;
        if (!isAuth) {
            return (
                <Redirect
                    to={{ pathname: "/", state: { from: props.location } }}
                />
            );
        }

        return <Component {...props} />;
    };

    return <Route {...rest} render={renderFunc} />;
};

export default PrivateRoute;
