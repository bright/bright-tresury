import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import Error from '../components/error/Error'
import Loader from '../components/loading/Loader'
import NetworkNotFound from './NetworkNotFound'
import { useGetNetworks } from './networks.api'
import { Network } from './networks.dto'
import { Nil } from '../util/types'

export const NETWORK_ID_SEARCH_PARAM_NAME = 'networkId'

interface State {
    networks: Network[]
    network: Network
    selectNetwork: (networkId: string, pathName?: string, search?: string) => void
    findNetwork: (networkId: string) => Nil<Network>
}

export const NetworksContext = React.createContext<State | undefined>(undefined)

interface OwnProps {}

export type NetworksContextProviderProps = PropsWithChildren<OwnProps>

const NetworksContextProvider = ({ children }: NetworksContextProviderProps) => {
    const { t } = useTranslation()
    const { isError, isLoading, data: networks } = useGetNetworks()
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [networkId, setNetworkId] = useState<string | undefined>()
    const history = useHistory()
    const { pathname, search } = useLocation()

    const redirect = (networkId: string, customPathName?: string, customSearch?: string) => {
        // We set the `isRedirecting` param to hide the app while redirecting
        setIsRedirecting(true)

        const newSearch = new URLSearchParams(customSearch ?? search)
        newSearch.set(NETWORK_ID_SEARCH_PARAM_NAME, networkId)

        history.push({
            pathname: customPathName ?? pathname,
            search: newSearch.toString(),
        })
        // We need to reload the page once the network is changed, because there is no way to clean the keyring. We need to initialise it again.
        window.location.reload()
    }

    useEffect(() => {
        if (networks) {
            const networkIdParam = new URLSearchParams(search).get(NETWORK_ID_SEARCH_PARAM_NAME)
            setNetworkId(networkIdParam ?? networks[0]?.id ?? '')
        }
    }, [networks])

    const network = useMemo(() => networks?.find((n) => n.id === networkId), [networks, networkId])

    if (isLoading || isRedirecting || networkId === undefined) {
        return <Loader text={t('networks.loading')} />
    }

    if (isError || !networks) {
        return <Error text={t('networks.error')} />
    }

    if (!network) {
        return <NetworkNotFound networks={networks} selectNetwork={redirect} />
    }

    const findNetwork = (networkId: string) => networks.find(({ id }) => networkId === id)

    return (
        <NetworksContext.Provider value={{ networks, network: network, selectNetwork: redirect, findNetwork }}>
            {children}
        </NetworksContext.Provider>
    )
}

export default NetworksContextProvider
