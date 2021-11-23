import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { Time } from '@polkadot/util/types'
import { UserEntity } from '../../../users/user.entity'
import { NetworkPlanckValue } from '../../../utils/types'
import { BlockchainAccountInfo } from '../../dto/blockchain-account-info.dto'

export enum BlockchainBountyStatus {
    Proposed = 'Proposed',
    Approved = 'Approved',
    Funded = 'Funded',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
}

export class BlockchainBountyDto {
    index: number
    description: string
    proposer: BlockchainAccountInfo
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    curator?: BlockchainAccountInfo
    updateDue?: Time
    beneficiary?: BlockchainAccountInfo
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
        proposer: BlockchainAccountInfo
        value: NetworkPlanckValue
        bond: NetworkPlanckValue
        curatorDeposit: NetworkPlanckValue
        curator?: BlockchainAccountInfo
        updateDue?: Time
        beneficiary?: BlockchainAccountInfo
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

    isCurator = (user: UserEntity) => UserEntity.hasWeb3Address(user, this.curator?.address)

    isProposer = (user: UserEntity) => UserEntity.hasWeb3Address(user, this.proposer.address)

    isOwner = (user: UserEntity) => this.isCurator(user) || this.isProposer(user)

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot add details to this bounty')
        }
    }

    isEditable = () => {
        return [
            BlockchainBountyStatus.Proposed,
            BlockchainBountyStatus.Approved,
            BlockchainBountyStatus.Funded,
            BlockchainBountyStatus.CuratorProposed,
            BlockchainBountyStatus.Active,
        ].includes(this.status)
    }

    isEditableOrThrow = () => {
        if (!this.isEditable()) {
            throw new BadRequestException('You cannot edit a rewarded bounty details')
        }
    }
}
