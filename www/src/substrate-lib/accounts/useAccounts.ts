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

export function useAccounts(): UseAccountsResult {
    const [state, dispatch] = useContext(AccountsContext)

    const { keyring, keyringState, accounts } = state
    const { network } = useNetworks()

    const loadAccounts = useCallback(async () => {
        if (keyringState || !dispatch) {
            return
        }

        try {
            const enable = await web3EnablePromise
            if (!enable) {
                await web3Enable(config.APP_NAME)
            }

            let allAccounts = await web3Accounts({ ss58Format: network.ss58Format })
            allAccounts = allAccounts.map(({ address, meta }) => ({
                address,
                meta: { ...meta, name: `${meta.name} (${meta.source})` },
            }))

            newKeyring.setSS58Format(network.ss58Format)
            newKeyring.loadAll(
                {
                    isDevelopment: network.developmentKeyring,
                    ss58Format: network.ss58Format,
                },
                allAccounts,
            )

            const keyringAccounts = newKeyring.getAccounts().map((account) => {
                const baseEncodedAddress = newKeyring.encodeAddress(account.address, 42)
                return {
                    name: account.meta.name || '',
                    address: account.address,
                    source: account.meta.source,
                    allowedInNetwork: !account.meta.genesisHash || account.meta.genesisHash === network.genesisHash,
                    baseEncodedAddress,
                } as Account
            })

            dispatch({ type: 'SET_KEYRING', keyring: newKeyring, accounts: keyringAccounts })
        } catch (e) {
            console.error(e)
            dispatch({ type: 'KEYRING_ERROR' })
        }
    }, [keyringState, dispatch])

    useEffect(() => {
        loadAccounts()
    }, [loadAccounts])

    return {
        keyring,
        keyringState,
        accounts,
        isWeb3Injected: polkadotIsWeb3Injected,
    }
}
