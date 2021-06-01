export interface IdeaDto {
    id: string
    ordinalNumber: number
    title: string
    beneficiary: string
    field?: string
    content: string
    networks: IdeaNetworkDto[]
    contact?: string
    portfolio?: string
    links?: string[]
    status: IdeaStatus
    ownerId: string
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
