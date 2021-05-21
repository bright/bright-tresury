import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROUTE_EMAIL_NOT_VERIFIED, ROUTE_SIGNIN } from './routes'

export type PrivateRouteProps = RouteProps

export const PrivateRoute = ({ component: Component, ...props }: PrivateRouteProps) => {
    const { isUserSignedIn, isUserVerified } = useAuth()

    if (isUserSignedIn && isUserVerified) {
        return <Route {...props} component={Component} />
    }

    if (isUserSignedIn && !isUserVerified) {
        return (
            <Route {...props}>
                <Redirect to={ROUTE_EMAIL_NOT_VERIFIED} />
            </Route>
        )
    }

    return (
        <Route {...props}>
            <Redirect to={ROUTE_SIGNIN} />
        </Route>
    )
}
