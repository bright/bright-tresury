import React from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import { SignOption } from './SignOption'
import { RouteComponentProps } from 'react-router'

type RouteComponent = React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>

interface OwnProps {
    emailComponent: RouteComponent
    web3Component: RouteComponent
}

export const SignSwitch: React.FC<OwnProps> = ({ emailComponent, web3Component }) => {
    let { path } = useRouteMatch()

    return (
        <Switch>
            <Route exact={true} path={path}>
                <Redirect to={`${path}/${SignOption.Email}`} />
            </Route>
            <Route exact={true} path={`${path}/${SignOption.Email}`} component={emailComponent} />
            <Route exact={true} path={`${path}/${SignOption.Web3}`} component={web3Component} />
        </Switch>
    )
}
