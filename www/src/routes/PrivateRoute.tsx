import React from 'react';
import {Redirect, Route, RouteProps} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {ROUTE_SIGNIN} from "./routes";

type PublicOnlyRoute = RouteProps

const PrivateRoute: React.FC<PublicOnlyRoute> = ({component: Component, ...props}) => {
    const {isUserVerified} = useAuth()

    // TODO redirect *somewhere* when user logged in but not verified (waiting for designs)
    if (isUserVerified) {
        return <Route {...props} component={Component}/>
    } else {
        return <Route {...props}>
            <Redirect to={ROUTE_SIGNIN}/>
        </Route>
    }
}

export default PrivateRoute
