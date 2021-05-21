import { web3FromAddress } from '@polkadot/extension-dapp'
import { Account } from '../substrate-lib/accounts/AccountsContext'
import {
    ConfirmBlockchainSignDto,
    confirmWeb3SignIn,
    confirmWeb3SignUp,
    startWeb3SignIn,
    startWeb3SignUp,
    Web3SignStartResponse,
} from './auth-web3.api'
import config from '../config/index'
import { stringToHex } from '@polkadot/util'

export async function handleWeb3SignUp(account: Account) {
    await handleWeb3Sign(account, startWeb3SignUp, async (confirmDto: ConfirmBlockchainSignDto) => {
        await confirmWeb3SignUp({
            ...confirmDto,
            network: config.NETWORK_NAME,
        })
    })
}

export async function handleWeb3SignIn(account: Account) {
    await handleWeb3Sign(account, startWeb3SignIn, confirmWeb3SignIn)
}

async function handleWeb3Sign(
    account: Account,
    startCall: (address: string) => Promise<Web3SignStartResponse>,
    confirmCall: (confirmDto: ConfirmBlockchainSignDto) => Promise<void>,
) {
    const injected = await web3FromAddress(account.address)
    if (!injected) {
        throw new Error('Injected was not found for this address')
    }
    const signRaw = injected && injected.signer && injected.signer.signRaw
    if (!signRaw) {
        throw new Error('Signer was not available')
    }

    const startSignUpResponse = await startCall(account.address)

    const signMessage = startSignUpResponse?.signMessage

    if (!signMessage) {
        throw new Error('Web3 sign challenge message not found')
    }

    const { signature } = await signRaw({
        address: account.address,
        data: stringToHex(signMessage),
        type: 'bytes',
    })

    await confirmCall({
        address: account.address,
        signature,
    })
}
