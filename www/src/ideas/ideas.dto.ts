import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'

export interface IdeaDto {
    id: string
    ordinalNumber: number
    beneficiary: string
    networks: IdeaNetworkDto[]
    status: IdeaStatus
    ownerId: string
    details: IdeaProposalDetailsDto
}

export interface IdeaNetworkDto {
    id?: string
    name: string
    value: number
}

export enum IdeaStatus {
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
    TurnedIntoProposalByMilestone = 'turned_into_proposal_by_milestone',
    Closed = 'closed',
}

export interface TurnIdeaIntoProposalDto {
    ideaNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}
