import React from 'react';
import {Redirect, Route, RouteProps} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {ROUTE_ROOT} from "./routes";

export type PublicOnlyRouteProps = RouteProps

const PublicOnlyRoute = ({ component: Component, ...props}: PublicOnlyRouteProps) => {
    const {isUserSignedIn} = useAuth()

    if (isUserSignedIn) {
        return <Route {...props}>
            <Redirect to={ROUTE_ROOT}/>
        </Route>
    } else {
        return <Route {...props} component={Component}/>
    }
}

export default PublicOnlyRoute
