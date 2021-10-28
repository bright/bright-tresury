import { CreateMilestoneDetailsDto, MilestoneDetailsDto } from '../../../milestone-details/milestone-details.dto'
import { NetworkPlanckValue, Nil } from '../../../util/types'

export enum IdeaMilestoneStatus {
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
}
export enum IdeaMilestoneNetworkStatus {
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
    Pending = 'pending',
}

export interface IdeaMilestoneDto {
    id: string
    ordinalNumber: number
    status: IdeaMilestoneStatus
    beneficiary: Nil<string>
    currentNetwork: IdeaMilestoneNetworkDto
    additionalNetworks: IdeaMilestoneNetworkDto[]
    details: MilestoneDetailsDto
}

export interface IdeaMilestoneNetworkDto {
    id: string
    name: string
    value: NetworkPlanckValue
    status: IdeaMilestoneNetworkStatus
}

export type CreateIdeaMilestoneDto = Omit<IdeaMilestoneDto, 'id' | 'ordinalNumber' | 'status' | 'details'> & {
    details: CreateMilestoneDetailsDto
}
export type PatchIdeaMilestoneDto = Partial<IdeaMilestoneDto>

export type UpdateIdeaMilestoneNetworkDto = Partial<IdeaMilestoneNetworkDto>
export type UpdateIdeaMilestoneNetworksItemDto = { id: string; value: NetworkPlanckValue }
export type UpdateIdeaMilestoneNetworksDto = { items: UpdateIdeaMilestoneNetworksItemDto[] }

export interface TurnIdeaMilestoneIntoProposalDto {
    ideaMilestoneNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}
