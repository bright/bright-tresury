import { NetworkPlanckValue } from '../../../utils/types'
import { BlockchainAccountInfo } from '../../dto/blockchain-account-info.dto'
import { Time } from '@polkadot/util/types'

export enum BlockchainBountyStatus {
    Proposed ='Proposed',
    Approved = 'Approved',
    Funded = 'Funded',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout'
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
        index, description, proposer, value, bond, curatorDeposit,
        curator, updateDue, beneficiary, unlockAt, fee, status
    }: BlockchainBountyDto) {
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
}
