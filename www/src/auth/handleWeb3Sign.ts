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
import { confirmWeb3Association, startWeb3Association, StartWeb3RequestDto } from './account/account.api'
import { Web3AssociateValues } from './account/web3/Web3AccountForm'

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

export async function handleAssociateWeb3Account(values: Web3AssociateValues) {
    const startCall = (address: string): Promise<Web3SignStartResponse> => {
        return startWeb3Association({ address, password: values.password } as StartWeb3RequestDto)
    }
    await handleWeb3Sign(values.account, startCall, confirmWeb3Association)
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
