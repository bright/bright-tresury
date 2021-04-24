import {web3Accounts as getWeb3Accounts, web3FromSource} from "@polkadot/extension-dapp";
import {Account} from '../../../substrate-lib/hooks/useAccounts';
import {confirmAddressSignUp, startAddressSignUp} from "../../auth-blockchain.api";
import config from "../../../config";
import {LoadingState} from "../../../components/loading/LoadingWrapper";
import {useCallback, useState} from "react";
import {stringToHex} from '@polkadot/util';

interface UseBlockchainSignUpResult {
    call: (account: Account) => Promise<void>
    loadingState: LoadingState
}

export function useBlockchainSignUp(): UseBlockchainSignUpResult {
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)

    const call = useCallback(async (account: Account) => {
        setLoadingState(LoadingState.Loading)
        return handleBlockchainSignup(account)
            .then(() => {
                setLoadingState(LoadingState.Resolved)
            })
            .catch((e) => {
                setLoadingState(LoadingState.Error)
            })
    }, [])

    return {call, loadingState}
}

export async function handleBlockchainSignup(account: Account) {
    const web3Accounts = await getWeb3Accounts();
    const web3Account = web3Accounts.find(web3Account => web3Account.address == account.address)
    if (!web3Account) {
        throw new Error('No web3 account associated')
    }
    const injected = await web3FromSource(web3Account.meta.source);
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

    const confirmSignUpResponse = await confirmAddressSignUp({
        address: account.address,
        network: config.NETWORK_NAME,
        signature
    });

    if (confirmSignUpResponse?.token) {
        handleTokenChange(confirmSignUpResponse.token, currentUser);
        setModal({
            content: 'Add an email in settings if you want to be able to recover your account!',
            title: 'Add optional email'
        });
        history.goBack();
    } else {
        throw new Error('Web3 sign up failed');
    }
}
