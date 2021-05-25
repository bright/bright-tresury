import { web3FromAddress } from '@polkadot/extension-dapp'
import { Account } from '../substrate-lib/accounts/AccountsContext'
import {StartEmailPasswordAssociateDto} from "./account/emailPassword/email-password.api";
import {
    confirmWeb3SignIn,
    confirmWeb3SignUp,
    startWeb3SignIn,
    startWeb3SignUp,
} from './auth-web3.api'
import config from '../config/index'
import { stringToHex } from '@polkadot/util'
import { Nil } from '../util/types'
import { Web3AssociateValues } from './account/web3/Web3AccountForm'
import {confirmWeb3Association, startWeb3Association} from './account/web3/web3.api'


//// TODO move
export async function handleWeb3SignUp(account: Account) {
    await handleWeb3Sign(account, startWeb3SignUp, async (confirmDto: ConfirmWeb3SignRequestDto) => {
        await confirmWeb3SignUp({
            ...confirmDto,
            details: {
                network: config.NETWORK_NAME,
            }
        })
    })
}

export async function handleWeb3SignIn(account: Account) {
    await handleWeb3Sign(account, startWeb3SignIn, confirmWeb3SignIn)
}

export async function handleAssociateWeb3Account(values: Web3AssociateValues) {
    const startCall = (dto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> => {
        return startWeb3Association({ address: dto.address, password: values.password} )
    }
    await handleWeb3Sign(values.account, startCall, confirmWeb3Association)
}

////



export interface StartWeb3SignRequestDto {
    address: string
    details: Nil<any>
}

export interface StartWeb3SignResponseDto {
    signMessage: string
}

export interface ConfirmWeb3SignRequestDto {
    address: string
    signature: string
    details: Nil<any>
}

export async function handleWeb3Sign(
    account: Account,
    startCall: (dto: StartWeb3SignRequestDto) => Promise<StartWeb3SignResponseDto>,
    confirmCall: (confirmDto: ConfirmWeb3SignRequestDto) => Promise<void | any>,
    details?: any
) {
    const injected = await web3FromAddress(account.address)
    if (!injected) {
        throw new Error('Injected was not found for this address')
    }
    const signRaw = injected && injected.signer && injected.signer.signRaw
    if (!signRaw) {
        throw new Error('Signer was not available')
    }

    const startSignUpResponse = await startCall({address: account.address, details})

    const signMessage = startSignUpResponse?.signMessage

    if (!signMessage) {
        throw new Error('Web3 sign challenge message not found')
    }

    const { signature } = await signRaw({
        address: account.address,
        data: stringToHex(signMessage),
        type: 'bytes',
    })

    return await confirmCall({
        address: account.address,
        signature,
        details
    })
}
