import {web3FromAddress} from '@polkadot/extension-dapp'
import {stringToHex} from '@polkadot/util'
import {Account} from '../substrate-lib/accounts/AccountsContext'
import {Nil} from '../util/types'
import {confirmWeb3Association, startWeb3Association} from './account/web3/web3.api'
import {Web3AssociateValues} from './account/web3/Web3AccountForm'

//// TODO move

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
