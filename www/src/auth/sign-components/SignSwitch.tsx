import React from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import { SignOption } from './SignOption'
import { RouteComponentProps } from 'react-router'

type RouteComponent = React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>

export interface SignSwitchProps {
    emailComponent: RouteComponent
    web3Component: RouteComponent
}

const SignSwitch = ({ emailComponent, web3Component }: SignSwitchProps) => {
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

export default SignSwitch
