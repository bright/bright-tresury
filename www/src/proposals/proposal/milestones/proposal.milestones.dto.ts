import { MilestoneDetailsDto } from '../../../milestone-details/milestone-details.dto'

export interface ProposalMilestoneDto {
    id: string
    ordinalNumber: number
    details: MilestoneDetailsDto
}

export type CreateIdeaMilestoneDto = Omit<ProposalMilestoneDto, 'id' | 'ordinalNumber'>

export type PatchIdeaMilestoneDto = Partial<ProposalMilestoneDto>
