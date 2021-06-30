import React from 'react'
import { Redirect, RouteProps } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Route from './Route'
import { ROUTE_EMAIL_NOT_VERIFIED, ROUTE_SIGNIN } from './routes'

interface OwnProps {
    requireVerified: boolean
}

export type PrivateRouteProps = RouteProps & OwnProps

const PrivateRoute = ({ component, requireVerified, ...props }: PrivateRouteProps) => {
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

    return <Route {...props} component={component} />
}

export default PrivateRoute
