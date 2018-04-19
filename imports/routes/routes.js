// Library
import React from "react";
import { Redirect, Router, Route, Switch } from "react-router-dom";

// React Components
import DashboardChat from "../ui/app/DashboardChat";
import DashboardProfile from "../ui/app/DashboardProfile";
import Login from "../ui/auth/Login";
import Signup from "../ui/auth/Signup";
import NotFound from "../ui/NotFound";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

// APIs
import history from "../startup/history";

export const getRoutes = isAuthenticated => {
    return (
        <Router history={history}>
            <div>
                <Switch>
                    <PublicRoute
                        exact
                        path="/"
                        isAuth={isAuthenticated}
                        component={Login}
                    />

                    <PublicRoute
                        path="/signup"
                        isAuth={isAuthenticated}
                        component={Signup}
                    />

                    <PrivateRoute
                        exact
                        path="/dashboard"
                        isAuth={isAuthenticated}
                        component={DashboardChat}
                    />

                    <PrivateRoute
                        exact
                        path="/profile"
                        isAuth={isAuthenticated}
                        component={DashboardProfile}
                    />

                    <PrivateRoute
                        path="/profile/:id"
                        isAuth={isAuthenticated}
                        component={DashboardProfile}
                    />

                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    );
};
