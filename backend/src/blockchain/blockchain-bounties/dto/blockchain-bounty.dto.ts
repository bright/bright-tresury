import { ForbiddenException } from '@nestjs/common'
import { Time } from '@polkadot/util/types'
import { NetworkPlanckValue, Nil } from '../../../utils/types'
import { UserEntity } from '../../../users/entities/user.entity'
import { BlockNumber } from '@polkadot/types/interfaces'

export enum BlockchainBountyStatus {
    Proposed = 'Proposed',
    Approved = 'Approved',
    Funded = 'Funded',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
    Claimed = 'Claimed',
    Rejected = 'Rejected',
    Unknown = 'Unknown',
}

export class BlockchainBountyDto {
    index: number
    description: string
    proposer: string
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    curator?: string
    updateDue?: Nil<BlockNumber>
    beneficiary?: string
    unlockAt?: Time
    fee: NetworkPlanckValue
    status: BlockchainBountyStatus

    constructor({
        index,
        description,
        proposer,
        value,
        bond,
        curatorDeposit,
        curator,
        updateDue,
        beneficiary,
        unlockAt,
        fee,
        status,
    }: {
        index: number
        description: string
        proposer: string
        value: NetworkPlanckValue
        bond: NetworkPlanckValue
        curatorDeposit: NetworkPlanckValue
        curator?: string
        updateDue?: Nil<BlockNumber>
        beneficiary?: string
        unlockAt?: Time
        fee: NetworkPlanckValue
        status: BlockchainBountyStatus
    }) {
        this.index = index
        this.description = description
        this.proposer = proposer
        this.value = value
        this.fee = fee
        this.curator = curator
        this.updateDue = updateDue
        this.beneficiary = beneficiary
        this.unlockAt = unlockAt
        this.curatorDeposit = curatorDeposit
        this.bond = bond
        this.status = status
    }

    isCurator = (user: UserEntity) =>
        UserEntity.hasWeb3Address(user, this.curator) &&
        [BlockchainBountyStatus.Active, BlockchainBountyStatus.PendingPayout].includes(this.status)

    isProposer = (user: UserEntity) => UserEntity.hasWeb3Address(user, this.proposer)

    isOwner = (user: UserEntity) => this.isCurator(user) || this.isProposer(user)

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot add details to this bounty')
        }
    }
}
