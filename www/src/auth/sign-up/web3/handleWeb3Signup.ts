import {web3FromAddress} from "@polkadot/extension-dapp";
import {Account} from '../../../substrate-lib/hooks/useAccounts';
import {confirmAddressSignUp, startAddressSignUp} from "../../auth-web3.api";
import config from "../../../config";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {useCallback, useState} from "react";
import {stringToHex} from '@polkadot/util';
import {Web3SignUpValues} from "./Web3SignUp";
import {useTranslation} from "react-i18next";

interface UseWeb3SignUpResult {
    call: (values: Web3SignUpValues) => Promise<void>
    loadingState: LoadingState
    error?: string
}

export function useWeb3SignUp(): UseWeb3SignUpResult {
    const {t} = useTranslation()
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)
    const [error, setError] = useState<string | undefined>()

    const call = useCallback(async (
        values: Web3SignUpValues
    ) => {
        setLoadingState(LoadingState.Loading)
        try {
            await handleWeb3Signup(values.account)
            setLoadingState(LoadingState.Resolved)
        } catch (e) {
            setLoadingState(LoadingState.Error)
            setError(t('auth.signUp.web3SignUp.failureMessage'))
        }
    }, [])

    return {call, loadingState, error}
}

export async function handleWeb3Signup(account: Account) {
    const injected = await web3FromAddress(account.address);
    if (!injected) {
        throw new Error('Injected was not found for this address')
    }
    const signRaw = injected && injected.signer && injected.signer.signRaw;
    if (!signRaw) {
        throw new Error('Signer was not available')
    }

    const startSignUpResponse = await startAddressSignUp(account.address)

    const signMessage = startSignUpResponse?.signMessage;

    if (!signMessage) {
        throw new Error('Web3 sign up challenge message not found');
    }

    const {signature} = await signRaw({
        address: account.address,
        data: stringToHex(signMessage),
        type: 'bytes'
    });

    await confirmAddressSignUp({
        address: account.address,
        network: config.NETWORK_NAME,
        signature
    });
}
