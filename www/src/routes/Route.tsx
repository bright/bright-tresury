import React, { useEffect } from 'react'
import {
    Route as ReactRouterRoute,
    RouteProps as ReactRouterRouteProps,
    useHistory,
    useLocation,
} from 'react-router-dom'
import { NETWORK_ID_SEARCH_PARAM_NAME } from '../networks/NetworksContext'
import { useNetworks } from '../networks/useNetworks'

export type RouteProps = ReactRouterRouteProps

const Route = ({ component, render, children, ...props }: RouteProps) => {
    if (children) {
        return <ReactRouterRoute {...props}>{children}</ReactRouterRoute>
    } else if (render) {
        return <ReactRouterRoute {...props} render={withNetworkId(render)} />
    } else {
        return <ReactRouterRoute {...props} component={withNetworkId(component)} />
    }
}

export const withNetworkId = (Component: any) => (props: any) => {
    const { network } = useNetworks()
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        const newSearch = new URLSearchParams(location.search)
        if (!newSearch.has(NETWORK_ID_SEARCH_PARAM_NAME)) {
            newSearch.append(NETWORK_ID_SEARCH_PARAM_NAME, network.id)
            history.replace({
                ...location,
                search: newSearch.toString(),
            })
        }
    }, [])

    return <Component {...props} />
}

export default Route
