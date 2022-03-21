import { ApiPromise, WsProvider } from '@polkadot/api'
import { DefinitionRpcExt } from '@polkadot/types/types'
import React, { Dispatch, PropsWithChildren, useCallback, useEffect, useReducer, useState } from 'react'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import { useNetworks } from '../../networks/useNetworks'

type State = {
    socket: string
    jsonrpc: Record<string, Record<string, DefinitionRpcExt>>
    types: any
    api?: ApiPromise
    apiError?: any
    apiState?: ApiState
}

type Action =
    | { type: 'RESET_SOCKET'; socket: string }
    | { type: 'CONNECT'; api: ApiPromise }
    | { type: 'CONNECT_SUCCESS' }
    | { type: 'CONNECT_ERROR'; apiError: any }

const INIT_STATE = {} as State

export enum ApiState {
    CONNECTING = 'CONNECTING',
    READY = 'READY',
    ERROR = 'ERROR',
}

const SubstrateContext = React.createContext<State>(INIT_STATE)

interface OwnProps {}
export type SubstrateContextProviderProps = PropsWithChildren<OwnProps>

const SubstrateContextProvider = ({ children }: SubstrateContextProviderProps) => {
    const { network } = useNetworks()
    const initState = {
        jsonrpc: { ...jsonrpc, ...network.rpc },
        socket: network.url,
        types: network.customTypes,
    } as State

    const [state, setState] = useState<State>(initState)

    const connect = useCallback(async () => {
        const { api, socket, jsonrpc, types } = state
        if (api) {
            return
        }
        console.log(`Connecting to ${socket} with types:`, types)
        const provider = new WsProvider(socket)
        const _api = new ApiPromise({ provider, types, rpc: jsonrpc })

        // We want to listen to event for disconnection and reconnection.
        //  That's why we set for listeners.
        _api.on('connected', () => {
            setState({ ...state, apiState: ApiState.CONNECTING, api: _api })
            // `ready` event is not emitted upon reconnection. So we check explicitly here.
            _api.isReady.then((_api) => setState({ ...state, apiState: ApiState.READY, api: _api }))
        })
        _api.on('ready', () => {
            _api.isReady.then((_api) => setState({ ...state, apiState: ApiState.READY, api: _api }))
        })
        _api.on('error', (err) => {
            _api.isReady.then((_api) => setState({ ...state, apiState: ApiState.ERROR, apiError: err }))
        })
    }, [state])

    useEffect(() => {
        connect()
    }, [connect])

    return <SubstrateContext.Provider value={state}>{children}</SubstrateContext.Provider>
}

const useSubstrate = () => {
    const context = React.useContext(SubstrateContext)
    if (!context) {
        throw new Error('useSubstrate must be used within an SubstrateContextProvider')
    }
    return context
}

export { SubstrateContext, SubstrateContextProvider, useSubstrate }
