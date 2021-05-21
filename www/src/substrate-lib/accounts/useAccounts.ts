import { useCallback, useContext, useEffect } from 'react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { keyring as polkadotKeyring } from '@polkadot/ui-keyring'
import { AccountsContext } from './AccountsContext'
import { Account } from './AccountsContext'
import config from '../../config'

export function useAccounts() {
    const [state, dispatch] = useContext(AccountsContext)

    const { keyring, keyringState, accounts } = state

    const loadAccounts = useCallback(async () => {
        if (keyringState || dispatch === undefined) {
            return
        }

        try {
            await web3Enable(config.APP_NAME)

            let allAccounts = await web3Accounts()

            allAccounts = allAccounts.map(({ address, meta }) => ({
                address,
                meta: { ...meta, name: `${meta.name} (${meta.source})` },
            }))

            polkadotKeyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts)

            const keyringAccounts = polkadotKeyring.getAccounts().map((account) => {
                return {
                    name: account.meta?.name || '',
                    address: account.address,
                    source: account.meta.source,
                } as Account
            })

            dispatch({ type: 'SET_KEYRING', keyring: polkadotKeyring, accounts: keyringAccounts })
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
    }
}
