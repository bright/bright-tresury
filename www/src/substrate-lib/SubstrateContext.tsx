import {ApiPromise} from "@polkadot/api";
import { DefinitionRpcExt } from "@polkadot/types/types";
import { Keyring } from "@polkadot/ui-keyring";
import React, { Dispatch, useReducer } from 'react';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import config from '../config';

console.log(`Connected socket: ${config.PROVIDER_SOCKET}`);

type State = {
    socket: string
    jsonrpc: Record<string, Record<string, DefinitionRpcExt>>
    types: any
    keyring?: Keyring
    keyringState?: KeyringState
    api?: ApiPromise
    apiError?: any
    apiState?: ApiState
}

type Props = {
    socket?: string
    types?: any
}

type Action =
    | { type: 'RESET_SOCKET', socket: string }
    | { type: 'CONNECT', api: ApiPromise }
    | { type: 'CONNECT_SUCCESS' }
    | { type: 'CONNECT_ERROR', apiError: any }
    | { type: 'SET_KEYRING', keyring: Keyring }
    | { type: 'KEYRING_ERROR' }

const INIT_STATE = {
    socket: config.PROVIDER_SOCKET,
    jsonrpc: { ...jsonrpc, ...config.RPC },
    types: config.CUSTOM_TYPES,
} as State;

export enum ApiState {
    CONNECTING = 'CONNECTING',
    READY = 'READY',
    ERROR = 'ERROR'
}

export enum KeyringState {
    READY = 'READY',
    ERROR = 'ERROR'
}

const reducer = (state: State, action: Action): State => {
    let socket = null;

    switch (action.type) {
        case 'RESET_SOCKET':
            socket = action.socket || state.socket;
            return { ...state, socket, api: undefined, apiState: undefined };

        case 'CONNECT':
            return { ...state, api: action.api, apiState: ApiState.CONNECTING };

        case 'CONNECT_SUCCESS':
            return { ...state, apiState: ApiState.READY };

        case 'CONNECT_ERROR':
            return { ...state, apiState: ApiState.ERROR, apiError: action.apiError };

        case 'SET_KEYRING':
            return { ...state, keyring: action.keyring, keyringState: KeyringState.READY };

        case 'KEYRING_ERROR':
            return { ...state, keyring: undefined, keyringState: KeyringState.ERROR };
    }
};

const SubstrateContext = React.createContext<[State, Dispatch<Action> | undefined]>([INIT_STATE, undefined]);

const SubstrateContextProvider: React.FC<Props> = ({ children, socket, types }) => {
    const initState = {
        ...INIT_STATE,
        socket: socket ?? INIT_STATE.socket,
        types: types ?? INIT_STATE.types,
    } as State;
    const [state, dispatch] = useReducer(reducer, initState);

    return (
        <SubstrateContext.Provider value={[state, dispatch]}>
            {children}
        </SubstrateContext.Provider>
    );
};

export { SubstrateContext, SubstrateContextProvider };
