import {web3FromAddress} from "@polkadot/extension-dapp";
import {Account} from '../../../substrate-lib/hooks/useAccounts';
import {confirmAddressSignUp, startAddressSignUp} from "../../auth-blockchain.api";
import config from "../../../config";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {useCallback, useState} from "react";
import {stringToHex} from '@polkadot/util';
import {BlockchainSignUpValues} from "./BlockchainSignUp";
import {useTranslation} from "react-i18next";

interface UseBlockchainSignUpResult {
    call: (values: BlockchainSignUpValues) => Promise<void>
    loadingState: LoadingState
    error?: string
}

export function useBlockchainSignUp(): UseBlockchainSignUpResult {
    const {t} = useTranslation()
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)
    const [error, setError] = useState<string | undefined>()

    const call = useCallback(async (
        values: BlockchainSignUpValues
    ) => {
        setLoadingState(LoadingState.Loading)
        try {
            await handleBlockchainSignup(values.account)
            setLoadingState(LoadingState.Resolved)
        } catch (e) {
            setLoadingState(LoadingState.Error)
            setError(t('auth.signUp.blockchainSignUp.failureMessage'))
        }
    }, [])

    return {call, loadingState, error}
}

export async function handleBlockchainSignup(account: Account) {
    // const web3Accounts = await getWeb3Accounts();
    // const web3Account = web3Accounts.find(web3Account => web3Account.address === account.address)
    // if (!web3Account) {
    //     throw new Error('No web3 account associated')
    // }
    // TODO - sprawdz czy to dziala
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
