import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Error from '../components/error/Error'
import Loader from '../components/loading/Loader'
import { useTheme } from '../theme/ThemeWrapper'
import { useGetNetworks } from './networks.api'
import { Network } from './networks.dto'

interface State {
    networks: Network[]
    selectedNetwork: Network
    selectNetwork: (network: Network) => void
}

export const NetworksContext = React.createContext<State | undefined>(undefined)

interface OwnProps {}

export type NetworksContextProviderProps = PropsWithChildren<OwnProps>

const NetworksContextProvider = ({ children }: NetworksContextProviderProps) => {
    const { t } = useTranslation()
    const [network, setNetwork] = useState<Network | undefined>()
    const { isError, isLoading, data: networks } = useGetNetworks()
    const { setNetworkColor } = useTheme()

    const selectNetwork = (network: Network) => {
        setNetwork(network)
        setNetworkColor(network.color)
    }

    useEffect(() => {
        if (networks && networks.length > 0) {
            const defaultNetwork = networks.find((n) => n.isDefault) || networks[0]
            selectNetwork(defaultNetwork)
        } else {
            setNetwork(undefined)
        }
    }, [networks])

    if (isLoading) {
        return <Loader text={t('networks.loading')} />
    }

    if (isError || !networks) {
        return <Error text={t('networks.error')} />
    }

    if (!network) {
        // TODO Show proper error screen
        return <p>No such network</p>
    }

    return (
        <NetworksContext.Provider value={{ networks, selectedNetwork: network, selectNetwork }}>
            {children}
        </NetworksContext.Provider>
    )
}

export default NetworksContextProvider
