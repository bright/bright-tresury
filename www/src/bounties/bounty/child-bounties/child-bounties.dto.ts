import { NetworkPlanckValue, Nil } from '../../../util/types'

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
    curator: Nil<string>
    curatorDeposit: NetworkPlanckValue
    beneficiary: Nil<string>
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
