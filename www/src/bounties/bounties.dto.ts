import { Time } from '@polkadot/util/types'
import { AccountInfo, NetworkPlanckValue, Nil } from '../util/types'

export enum BountyStatus {
    Proposed = 'proposed',
    Approved = 'approved',
    Funded = 'funded',
    CuratorProposed = 'curator-proposed',
    Active = 'active',
    PendingPayout = 'pending-payout',
}

interface ProposedBounty {
    status: BountyStatus.Proposed
}

interface ApprovedBounty {
    status: BountyStatus.Approved
}

interface FundedBounty {
    status: BountyStatus.Funded
}

interface CuratorProposedBounty {
    status: BountyStatus.CuratorProposed
    curatorsFee: NetworkPlanckValue
    curator: AccountInfo
}

interface ActiveBounty {
    status: BountyStatus.Active
    curatorsFee: NetworkPlanckValue
    curator: AccountInfo
    updateDue: Time
}

interface PendingPayoutBounty {
    status: BountyStatus.PendingPayout
    curatorsFee: NetworkPlanckValue
    curator: AccountInfo
    beneficiary: AccountInfo
    unlockAt: Time
}

interface BaseBountyDto {
    id?: Nil<string>
    blockchainIndex: number
    blockchainDescription: string
    value: NetworkPlanckValue
    deposit: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    proposer: AccountInfo

    title?: Nil<string>
    field?: Nil<string>
    description?: Nil<string>
}

type ExtendedBountyDto =
    | ProposedBounty
    | ApprovedBounty
    | FundedBounty
    | CuratorProposedBounty
    | ActiveBounty
    | PendingPayoutBounty

export type BountyDto = BaseBountyDto & ExtendedBountyDto

export interface CreateBountyDto {
    blockchainDescription: string
    value: NetworkPlanckValue
    title: string
    field?: Nil<string>
    description?: Nil<string>
    networkId: string
    proposer: string
    extrinsicHash: string
    lastBlockHash: string
}

export interface BountyExtrinsicDto {
    data: CreateBountyDto
    extrinsicHash: string
    lastBlockHash: string
}
