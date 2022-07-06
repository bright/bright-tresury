import { NetworkPlanckValue, Nil } from '../../../utils/types'
import { UserEntity } from '../../../users/entities/user.entity'

export enum BlockchainChildBountyStatus {
    Added = 'Added',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
    Awarded = 'Awarded',
    Claimed = 'Claimed',
    Canceled = 'Canceled',
    Unknown = 'Unknown',
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
        curator: Nil<string>
        curatorDeposit: NetworkPlanckValue
        beneficiary: Nil<string>
        unlockAt: Nil<string>
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

    isCurator = (user: UserEntity) =>
        UserEntity.hasWeb3Address(user, this.curator) &&
        [
            BlockchainChildBountyStatus.Active,
            BlockchainChildBountyStatus.PendingPayout,
            BlockchainChildBountyStatus.CuratorProposed,
            BlockchainChildBountyStatus.Awarded,
            BlockchainChildBountyStatus.Claimed,
            BlockchainChildBountyStatus.Canceled,
        ].includes(this.status)

    isOwner = (user: UserEntity) => this.isCurator(user)
}
