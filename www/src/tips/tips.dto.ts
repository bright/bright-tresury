import { NetworkPlanckValue, Nil } from '../util/types'
import { PublicUserDto } from '../util/publicUser.dto'
import { PolkassemblyPostDto } from '../components/polkassemblyDescription/polkassembly-post.dto'

export enum TipStatus {
    Proposed = 'Proposed',
    Tipped = 'Tipped',
    Closing = 'Closing',
    PendingPayout = 'PendingPayout',
}

export interface TipDto {
    hash: string
    reason: Nil<string>
    finder: PublicUserDto
    beneficiary: PublicUserDto
    tips: TippingDto[]
    deposit: NetworkPlanckValue
    findersFee: boolean

    title: Nil<string>
    description: Nil<string>
    owner: Nil<PublicUserDto>

    polkassembly?: Nil<PolkassemblyPostDto>

    status: TipStatus
}

export interface TippingDto {
    tipper: PublicUserDto
    value: NetworkPlanckValue
}

export interface CreateTipDto {
    blockchainReason: string
    finder: string
    beneficiary: string
    title: string
    description?: Nil<string>
    networkId: string
    extrinsicHash: string
    lastBlockHash: string
}

export interface TipExtrinsicDto {
    data: CreateTipDto
    extrinsicHash: string
    lastBlockHash: string
}
