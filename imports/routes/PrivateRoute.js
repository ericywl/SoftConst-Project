import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, isAuth, ...rest }) => {
    const authPages = ["/dashboard"];
    const renderFunc = props => {
        // check if user is trying to access page that requires auth
        const onAuthPage = authPages.includes(props.location.pathname);

        if (!isAuth && onAuthPage) {
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
