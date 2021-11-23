import { Time } from '@polkadot/util/types'
import { AccountInfo, NetworkPlanckValue, Nil } from '../util/types'

export enum BountyStatus {
    Proposed = 'Proposed',
    Approved = 'Approved',
    Funded = 'Funded',
    CuratorProposed = 'CuratorProposed',
    Active = 'Active',
    PendingPayout = 'PendingPayout',
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
    curatorFee: NetworkPlanckValue
    curator: AccountInfo
}

interface ActiveBounty {
    status: BountyStatus.Active
    curatorFee: NetworkPlanckValue
    curator: AccountInfo
    updateDue?: Time
}

interface PendingPayoutBounty {
    status: BountyStatus.PendingPayout
    curatorFee: NetworkPlanckValue
    curator: AccountInfo
    beneficiary: AccountInfo
    unlockAt?: Time
}

interface BaseBountyDto {
    id?: Nil<string>
    blockchainIndex: number
    blockchainDescription: string
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    proposer: AccountInfo

    beneficiary?: AccountInfo
    title?: Nil<string>
    field?: Nil<string>
    description?: Nil<string>
    ownerId?: string
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

export interface EditBountyDto {
    title: string
    field?: Nil<string>
    description?: Nil<string>
    beneficiary?: string
}

export interface BountyExtrinsicDto {
    data: CreateBountyDto
    extrinsicHash: string
    lastBlockHash: string
}
