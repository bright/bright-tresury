import { NetworkPlanckValue, Nil } from '../../../utils/types'

export enum BlockchainChildBountyStatus {
    Added = 'Added',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
}

export class BlockchainChildBountyDto {
    index: number
    parentIndex: number
    description: string
    value: NetworkPlanckValue
    fee: NetworkPlanckValue
    curator: Nil<string>
    curatorDeposit: NetworkPlanckValue
    beneficiary: Nil<string>
    unlockAt: Nil<string>
    status: BlockchainChildBountyStatus

    constructor({
        index,
        parentIndex,
        description,
        value,
        fee,
        curator,
        curatorDeposit,
        beneficiary,
        unlockAt,
        status,
    }: {
        index: number
        parentIndex: number
        description: string
        value: NetworkPlanckValue
        fee: NetworkPlanckValue
        curator: string
        curatorDeposit: NetworkPlanckValue
        beneficiary: string
        unlockAt: string
        status: BlockchainChildBountyStatus
    }) {
        this.index = index
        this.parentIndex = parentIndex
        this.description = description
        this.value = value
        this.fee = fee
        this.curator = curator
        this.curatorDeposit = curatorDeposit
        this.beneficiary = beneficiary
        this.unlockAt = unlockAt
        this.status = status
    }
}
