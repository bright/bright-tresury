import {
    CreateMilestoneDetailsDto,
    MilestoneDetailsDto,
    UpdateMilestoneDetailsDto,
} from '../../../milestone-details/milestone-details.dto'

export interface ProposalMilestoneDto {
    id: string
    details: MilestoneDetailsDto
}

export type CreateProposalMilestoneDto = {
    details: CreateMilestoneDetailsDto
}

export type UpdateProposalMilestoneDto = {
    details?: UpdateMilestoneDetailsDto
}
