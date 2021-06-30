import { ApiPromise } from '@polkadot/api'
import { DefinitionRpcExt } from '@polkadot/types/types'
import React, { Dispatch, PropsWithChildren, useReducer } from 'react'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import { useNetworks } from '../../networks/useNetworks'
import config from '../../config'

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

const INIT_STATE = {
    socket: config.PROVIDER_SOCKET,
    jsonrpc: { ...jsonrpc, ...config.RPC },
    types: config.CUSTOM_TYPES,
} as State

export enum ApiState {
    CONNECTING = 'CONNECTING',
    READY = 'READY',
    ERROR = 'ERROR',
}

const reducer = (state: State, action: Action): State => {
    let socket = null

    switch (action.type) {
        case 'RESET_SOCKET':
            socket = action.socket || state.socket
            return { ...state, socket, api: undefined, apiState: undefined }

        case 'CONNECT':
            return { ...state, api: action.api, apiState: ApiState.CONNECTING }

        case 'CONNECT_SUCCESS':
            return { ...state, apiState: ApiState.READY }

        case 'CONNECT_ERROR':
            return { ...state, apiState: ApiState.ERROR, apiError: action.apiError }
    }
}

const SubstrateContext = React.createContext<[State, Dispatch<Action> | undefined]>([INIT_STATE, undefined])

interface OwnProps {}
export type SubstrateContextProviderProps = PropsWithChildren<OwnProps>

const SubstrateContextProvider = ({ children }: SubstrateContextProviderProps) => {
    const { network } = useNetworks()
    const initState = {
        jsonrpc: { ...jsonrpc, ...network.rpc },
        socket: network.url,
        types: network.customTypes,
    } as State

    const [state, dispatch] = useReducer(reducer, initState)

    return <SubstrateContext.Provider value={[state, dispatch]}>{children}</SubstrateContext.Provider>
}

export { SubstrateContext, SubstrateContextProvider }
