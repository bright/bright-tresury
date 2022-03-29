import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import { NetworkPlanckValue, Nil } from '../util/types'
import { PublicUserDto } from '../util/publicUser.dto'

export interface IdeaDto {
    id: string
    ordinalNumber: number
    beneficiary?: Nil<PublicUserDto>
    currentNetwork: IdeaNetworkDto
    additionalNetworks: IdeaNetworkDto[]
    status: IdeaStatus
    owner: PublicUserDto
    details: IdeaProposalDetailsDto
}

export interface EditIdeaDto {
    id?: string
    beneficiary?: string
    currentNetwork: EditIdeaNetworkDto
    additionalNetworks: EditIdeaNetworkDto[]
    status?: IdeaStatus
    details: IdeaProposalDetailsDto
}

export interface IdeaNetworkDto {
    id: string
    name: string
    value: NetworkPlanckValue
    status: IdeaNetworkStatus
    blockchainProposalId: Nil<number>
}

export interface EditIdeaNetworkDto {
    id?: string
    name: string
    value: NetworkPlanckValue
}

export interface EditSingleIdeaNetworkDto {
    id: string
    value: NetworkPlanckValue
}

export enum IdeaStatus {
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
    Pending = 'pending',
    MilestoneSubmission = 'milestone_submission',
    Closed = 'closed',
}

export enum IdeaNetworkStatus {
    Active = 'active',
    Pending = 'pending',
    TurnedIntoProposal = 'turned_into_proposal',
}

export interface TurnIdeaIntoProposalDto {
    ideaNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}
