import * as React from 'react'
import { NetworksContext } from './NetworksContext'

export function useNetworks() {
    const context = React.useContext(NetworksContext)
    if (!context) {
        throw new Error('useAuth must be used within an NetworksContextProvider')
    }

    return context
}
