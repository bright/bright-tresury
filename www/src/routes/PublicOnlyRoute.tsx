import React from 'react'
import { Redirect, RouteProps } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Route from './Route'
import { ROUTE_ROOT } from './routes'

interface OwnProps {
    redirectTo?: string
}

export type PublicOnlyRouteProps = RouteProps & OwnProps

export const PublicOnlyRoute = ({ component: Component, redirectTo, ...props }: PublicOnlyRouteProps) => {
    const { isUserSignedIn } = useAuth()

    if (isUserSignedIn) {
        return (
            <Route {...props}>
                <Redirect to={redirectTo ?? ROUTE_ROOT} />
            </Route>
        )
    } else {
        return <Route {...props} component={Component} />
    }
}
