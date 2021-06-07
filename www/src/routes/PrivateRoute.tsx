import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROUTE_EMAIL_NOT_VERIFIED, ROUTE_SIGNIN } from './routes'

interface OwnProps {
    requireVerified: boolean
}

export type PrivateRouteProps = RouteProps & OwnProps

export const PrivateRoute = ({ component: Component, requireVerified, ...props }: PrivateRouteProps) => {
    const { isUserSignedIn, isUserVerified } = useAuth()

    if (!isUserSignedIn) {
        return (
            <Route {...props}>
                <Redirect to={ROUTE_SIGNIN} />
            </Route>
        )
    }

    if (requireVerified && !isUserVerified) {
        return (
            <Route {...props}>
                <Redirect to={ROUTE_EMAIL_NOT_VERIFIED} />
            </Route>
        )
    }

    return <Route {...props} component={Component} />
}
