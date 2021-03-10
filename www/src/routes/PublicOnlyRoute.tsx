import React from 'react';
import {Redirect, Route, RouteProps} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {ROUTE_ROOT} from "./routes";

type PublicOnlyRoute = RouteProps

const PublicOnlyRoute: React.FC<PublicOnlyRoute> = ({ component: Component, ...props}) => {
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
