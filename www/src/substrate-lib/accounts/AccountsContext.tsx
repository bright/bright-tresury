import { Keyring } from '@polkadot/ui-keyring'
import React, { Dispatch, useReducer } from 'react'

export interface Account {
    name: string
    address: string
    source: string
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

const AccountsContextProvider: React.FC = ({ children }) => {
    const initState = {
        keyring: undefined,
        keyringState: undefined,
        accounts: [],
    } as State

    const [state, dispatch] = useReducer(reducer, initState)

    return <AccountsContext.Provider value={[state, dispatch]}>{children}</AccountsContext.Provider>
}

export { AccountsContext, AccountsContextProvider }
