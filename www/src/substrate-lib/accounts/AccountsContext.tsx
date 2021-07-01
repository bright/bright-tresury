import { Keyring } from '@polkadot/ui-keyring'
import React, { Dispatch, PropsWithChildren, useReducer } from 'react'

export interface Account {
    name: string
    address: string
    source: string
    allowedInNetwork: boolean
    baseEncodedAddress: string
}

type State = {
    keyring?: Keyring
    keyringState?: KeyringState
    accounts: Account[]
}

type Action = { type: 'SET_KEYRING'; keyring: Keyring; accounts: Account[] } | { type: 'KEYRING_ERROR' }

const INIT_STATE = {
    keyring: undefined,
    keyringState: undefined,
    accounts: [],
} as State

export enum KeyringState {
    READY = 'READY',
    ERROR = 'ERROR',
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_KEYRING':
            return { ...state, keyring: action.keyring, accounts: action.accounts, keyringState: KeyringState.READY }

        case 'KEYRING_ERROR':
            return { ...state, keyring: undefined, keyringState: KeyringState.ERROR }
    }
}

const AccountsContext = React.createContext<[State, Dispatch<Action> | undefined]>([INIT_STATE, undefined])

interface OwnProps {}

export type AccountsContextProviderProps = PropsWithChildren<OwnProps>

const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
    const initState = {
        keyring: undefined,
        keyringState: undefined,
        accounts: [],
    } as State

    const [state, dispatch] = useReducer(reducer, initState)

    return <AccountsContext.Provider value={[state, dispatch]}>{children}</AccountsContext.Provider>
}

export { AccountsContext, AccountsContextProvider }
