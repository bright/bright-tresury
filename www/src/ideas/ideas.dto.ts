import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import { Nil } from '../util/types'

export interface IdeaDto {
    id: string
    ordinalNumber: number
    beneficiary: string
    currentNetwork: IdeaNetworkDto
    additionalNetworks: IdeaNetworkDto[]
    status: IdeaStatus
    ownerId: string
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
    value: number
    status: IdeaNetworkStatus
    blockchainProposalId: Nil<number>
}

export interface EditIdeaNetworkDto {
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
