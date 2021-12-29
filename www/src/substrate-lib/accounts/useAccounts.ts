import { KeyringJson$Meta } from '@polkadot/ui-keyring/types'
import { KeypairType } from '@polkadot/util-crypto/types'
import { useCallback, useContext, useEffect } from 'react'
import {
    isWeb3Injected as polkadotIsWeb3Injected,
    web3Accounts,
    web3Enable,
    web3EnablePromise,
} from '@polkadot/extension-dapp'
import { Keyring, keyring as newKeyring } from '@polkadot/ui-keyring'
import { useNetworks } from '../../networks/useNetworks'
import { AccountsContext, KeyringState } from './AccountsContext'
import { Account } from './AccountsContext'
import config from '../../config'

export interface UseAccountsResult {
    keyring: Keyring | undefined
    keyringState: KeyringState | undefined
    accounts: Account[]
    isWeb3Injected: boolean
}

interface AccountToLoad {
    address: string
    meta: KeyringJson$Meta
    type?: KeypairType
}

export function useAccounts(): UseAccountsResult {
    const [state, dispatch] = useContext(AccountsContext)

    const { keyring, keyringState, accounts } = state
    const { network } = useNetworks()

    const enableExtension = async () => {
        const enable = await web3EnablePromise
        if (!enable) {
            await web3Enable(config.APP_NAME)
        }
    }

    const getInjectedAccounts = async (): Promise<AccountToLoad[]> => {
        let allAccounts = await web3Accounts({ ss58Format: network.ss58Format })
        return allAccounts.map(({ address, meta }) => ({
            address,
            meta: { ...meta, name: `${meta.name} (${meta.source})` },
        }))
    }

    const loadAccountsToKeyring = (accounts: AccountToLoad[]) => {
        newKeyring.setSS58Format(network.ss58Format)
        newKeyring.loadAll(
            {
                isDevelopment: network.developmentKeyring,
                ss58Format: network.ss58Format,
            },
            accounts,
        )
    }

    const getKeyringAccounts = (): Account[] =>
        newKeyring.getAccounts().map((account) => {
            const baseEncodedAddress = newKeyring.encodeAddress(account.address, 42)
            return {
                name: account.meta.name || '',
                address: account.address,
                source: account.meta.source,
                allowedInNetwork: !account.meta.genesisHash || account.meta.genesisHash === network.genesisHash,
                baseEncodedAddress,
            } as Account
        })

    const loadAccounts = useCallback(async () => {
        if (keyringState || !dispatch) {
            return
        }
        try {
            await enableExtension()

            let injectedAccounts = await getInjectedAccounts()

            // accounts already loaded or no accounts to load
            if (newKeyring.getAccounts().length !== 0 || injectedAccounts.length === 0) {
                return
            }
            loadAccountsToKeyring(injectedAccounts)

            dispatch({ type: 'SET_KEYRING', keyring: newKeyring, accounts: getKeyringAccounts() })
        } catch (e) {
            console.error(e)
            dispatch({ type: 'KEYRING_ERROR' })
        }
    }, [])

    useEffect(() => {
        loadAccounts()
    }, [])

    return {
        keyring,
        keyringState,
        accounts,
        isWeb3Injected: polkadotIsWeb3Injected,
    }
}
