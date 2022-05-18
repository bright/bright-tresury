import { NetworkPlanckValue, Nil } from '../../../util/types'

export enum ChildBountyStatus {
    Added = 'Added',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
}

export interface ChildBountyDto {
    index: number
    parentIndex: number
    description: string
    value: NetworkPlanckValue
    fee: NetworkPlanckValue
    curator: Nil<string>
    curatorDeposit: NetworkPlanckValue
    beneficiary: Nil<string>
    unlockAt: Nil<string>
    status: ChildBountyStatus
}
