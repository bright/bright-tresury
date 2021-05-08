import {web3FromAddress} from "@polkadot/extension-dapp";
import {Account} from '../../../substrate-lib/hooks/useAccounts';
import {confirmAddressSignUp, startAddressSignUp} from "../../auth-web3.api";
import config from "../../../config";
import {stringToHex} from '@polkadot/util';

export async function handleWeb3SignIn(account: Account) {

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
