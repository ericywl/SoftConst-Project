// Library
import React from "react";
import { Redirect, Route } from "react-router-dom";

const PublicRoute = ({ component: Component, isAuth, ...rest }) => {
    const renderFunc = props => {
        // check if user is trying to access page that doesn't require auth
        if (isAuth) {
            return (
                <Redirect
                    to={{
                        pathname: "/dashboard",
                        state: { from: props.location }
                    }}
                />
            );
        }

        return <Component {...props} />;
    };

    return <Route {...rest} render={renderFunc} />;
};

export default PublicRoute;
