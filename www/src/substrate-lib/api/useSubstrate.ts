import { useContext, useEffect, useCallback } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'

import { SubstrateContext } from './SubstrateContext'

export const useSubstrate = () => {
    const [state, dispatch] = useContext(SubstrateContext)

    const { api, socket, jsonrpc, types } = state

    const connect = useCallback(async () => {
        if (api || dispatch === undefined) {
            return
        }

        console.log(`Connecting to ${socket} with types:`, types)
        const provider = new WsProvider(socket)
        const _api = new ApiPromise({ provider, types, rpc: jsonrpc })

        // We want to listen to event for disconnection and reconnection.
        //  That's why we set for listeners.
        _api.on('connected', () => {
            dispatch({ type: 'CONNECT', api: _api })
            // `ready` event is not emitted upon reconnection. So we check explicitly here.
            _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }))
        })
        _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }))
        _api.on('error', (err) => dispatch({ type: 'CONNECT_ERROR', apiError: err }))
    }, [api, socket, jsonrpc, types, dispatch])

    useEffect(() => {
        connect()
    }, [connect])

    return { ...state, dispatch }
}
