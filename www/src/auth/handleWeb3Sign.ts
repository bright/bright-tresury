import { web3FromAddress } from '@polkadot/extension-dapp'
import { stringToHex } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'
import { Account } from '../substrate-lib/accounts/AccountsContext'
import { Nil } from '../util/types'

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
    account: Account | string,
    startCall: (dto: StartWeb3SignRequestDto) => Promise<StartWeb3SignResponseDto>,
    confirmCall: (confirmDto: ConfirmWeb3SignRequestDto) => Promise<void | any>,
    details?: any,
) {
    const address = encodeAddress(typeof account === 'string' ? account : account.address)

    const injected = await web3FromAddress(address)

    const signRaw = injected && injected.signer && injected.signer.signRaw
    if (!signRaw) {
        throw new Error('Signer was not available')
    }

    const startSignUpResponse = await startCall({ address, details })

    const signMessage = startSignUpResponse?.signMessage
    if (!signMessage) {
        throw new Error('Web3 sign challenge message not found')
    }

    const { signature } = await signRaw({
        address,
        data: stringToHex(signMessage),
        type: 'bytes',
    })

    try {
        await confirmCall({
            address,
            signature,
            details,
        })
    } catch (err) {
        const anyErr = err as any
        if ('message' in anyErr) {
            throw new Error(anyErr.message)
        } else {
            throw new Error('Something went wrong when confirming transaction')
        }
    }
}
