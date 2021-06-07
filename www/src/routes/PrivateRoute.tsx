import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROUTE_EMAIL_NOT_VERIFIED, ROUTE_SIGNIN } from './routes'

interface OwnProps {
    requireBeingVerified: boolean
}

export type PrivateRouteProps = RouteProps & OwnProps

export const PrivateRoute = ({ component: Component, requireBeingVerified, ...props }: PrivateRouteProps) => {
    const { isUserSignedIn, isUserVerified } = useAuth()

    if (isUserSignedIn && (!requireBeingVerified || (requireBeingVerified && isUserVerified))) {
        return <Route {...props} component={Component} />
    }

    if (isUserSignedIn && requireBeingVerified && !isUserVerified) {
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
