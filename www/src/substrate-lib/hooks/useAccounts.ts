import {useEffect, useState} from "react";
import {useSubstrate} from "../index";
import {KeyringState} from "../SubstrateContext";

export interface Account {
    name: string,
    address: string
}

export function useAccounts(): Account[] {
    const [accounts, setAccounts] = useState<Account[]>([])

    const {keyringState, keyring} = useSubstrate();
    useEffect(() => {
        if (keyringState === KeyringState.READY && keyring) {
            const keyringAccounts = keyring.getAccounts().map((account) => {
                return {name: account.meta?.name || '', address: account.address} as Account
            })
            setAccounts(keyringAccounts)
        }
    }, [keyring, keyringState])
    return accounts;
}
