import { Time } from '@polkadot/util/types'
import { NetworkPlanckValue, Nil } from '../util/types'
import { PolkassemblyPostDto } from '../components/polkassemblyDescription/polkassembly-post.dto'
import { PublicUserDto } from '../util/publicUser.dto'
import { ChildBountyDto } from './bounty/child-bounties/child-bounties.dto'

export enum BountyStatus {
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
    curator: PublicUserDto
}

interface ActiveBounty {
    status: BountyStatus.Active
    curatorFee: NetworkPlanckValue
    curator: PublicUserDto
    updateDue?: Time
}

interface PendingPayoutBounty {
    status: BountyStatus.PendingPayout | BountyStatus.Claimed
    curatorFee: NetworkPlanckValue
    curator: PublicUserDto
    beneficiary: PublicUserDto
    unlockAt?: Time
}

interface RejectedBounty {
    status: BountyStatus.Rejected
}

interface UnknownBounty {
    status: BountyStatus.Unknown
}

interface BaseBountyDto {
    id?: Nil<string>
    blockchainIndex: number
    blockchainDescription: string
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    curatorDeposit: NetworkPlanckValue
    proposer: PublicUserDto

    beneficiary?: PublicUserDto
    title?: Nil<string>
    field?: Nil<string>
    description?: Nil<string>
    owner?: Nil<PublicUserDto>

    polkassembly?: Nil<PolkassemblyPostDto>
    childBounties?: ChildBountyDto[]
}

type ExtendedBountyDto =
    | ProposedBounty
    | ApprovedBounty
    | FundedBounty
    | CuratorProposedBounty
    | ActiveBounty
    | PendingPayoutBounty
    | RejectedBounty
    | UnknownBounty

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
