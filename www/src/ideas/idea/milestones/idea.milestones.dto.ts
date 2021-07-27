import { MilestoneDetailsDto } from '../../../milestone-details/milestone-details.dto'
import { Nil } from '../../../util/types'

export enum IdeaMilestoneStatus {
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
}

export interface IdeaMilestoneDto {
    id: string
    ordinalNumber: number
    status: IdeaMilestoneStatus
    beneficiary: Nil<string>
    networks: IdeaMilestoneNetworkDto[]
    details: MilestoneDetailsDto
}

export interface IdeaMilestoneNetworkDto {
    id: string
    name: string
    value: number
}

export type CreateIdeaMilestoneDto = Omit<IdeaMilestoneDto, 'id' | 'ordinalNumber' | 'status'>

export type PatchIdeaMilestoneDto = Partial<IdeaMilestoneDto>

export interface TurnIdeaMilestoneIntoProposalDto {
    ideaMilestoneNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}
