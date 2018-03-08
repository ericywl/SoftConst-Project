import React from "react";
import {
    Redirect,
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

import Dashboard from "../ui/Dashboard";
import Login from "../ui/Login";
import Signup from "../ui/Signup";
import NotFound from "../ui/NotFound";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

export const getRoutes = isAuthenticated => {
    return (
        <Router>
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
                        path="/dashboard"
                        isAuth={isAuthenticated}
                        component={Dashboard}
                    />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    );
};
