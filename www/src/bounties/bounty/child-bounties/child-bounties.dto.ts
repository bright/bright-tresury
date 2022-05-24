import { NetworkPlanckValue, Nil } from '../../../util/types'
import { PublicUserDto } from '../../../util/publicUser.dto'

export enum ChildBountyStatus {
    Added = 'Added',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
}

export interface ChildBountyDto {
    blockchainIndex: number
    parentBountyBlockchainIndex: number
    blockchainDescription: string
    value: NetworkPlanckValue
    curatorFee: NetworkPlanckValue
    curator: Nil<PublicUserDto>
    curatorDeposit: NetworkPlanckValue
    beneficiary: Nil<PublicUserDto>
    unlockAt: Nil<string>
    status: ChildBountyStatus

    title: Nil<string>
    description: Nil<string>
}
export interface CreateChildBountyDto {
    parentIndex: number
    title: string
    description?: Nil<string>
    networkId: string
    extrinsicHash: string
    lastBlockHash: string
}
