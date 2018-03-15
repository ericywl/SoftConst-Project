// Library
import React from "react";
import { Redirect, Router, Route, Switch } from "react-router-dom";

// React Components
import Dashboard from "../ui/app/Dashboard";
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
                        component={Dashboard}
                    />
      
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    );
};
