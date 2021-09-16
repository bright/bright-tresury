import { useQuery, UseQueryOptions } from 'react-query'
import { apiGet } from '../../../api'
import { ApiMilestoneDetailsDto, toMilestoneDetailsDto } from '../../../milestone-details/milestone-details.dto'
import { compareMilestones } from '../../../milestone-details/utils'
import { PROPOSALS_API_PATH } from '../../proposals.api'
import { ProposalMilestoneDto } from './proposal.milestones.dto'

const getApiBasePath = (proposalIndex: number) => {
    return `${PROPOSALS_API_PATH}/${proposalIndex}/milestones`
}

interface ApiProposalMilestoneDto {
    id: string
    ordinalNumber: number
    details: ApiMilestoneDetailsDto
}

interface ProposalMilestonesApiParams {
    proposalIndex: number
    network: string
}

// GET ALL

async function getProposalMilestones({
    proposalIndex,
    network,
}: ProposalMilestonesApiParams): Promise<ProposalMilestoneDto[]> {
    const result = await apiGet<ApiProposalMilestoneDto[]>(`${getApiBasePath(proposalIndex)}?network=${network}`)

    const mappedResult = result.map((milestone) => {
        return {
            ...milestone,
            details: toMilestoneDetailsDto(milestone.details),
        }
    })

    mappedResult.sort((a, b) => compareMilestones(a.details, b.details))
    return mappedResult.map((milestone, proposalIndex) => {
        return { ...milestone, ordinalNumber: proposalIndex + 1 }
    })
}

export const PROPOSAL_MILESTONES_QUERY_KEY_BASE = 'proposalMilestones'

export const useGetProposalMilestones = (
    params: ProposalMilestonesApiParams,
    options?: UseQueryOptions<ProposalMilestoneDto[]>,
) => {
    return useQuery(
        [PROPOSAL_MILESTONES_QUERY_KEY_BASE, params.proposalIndex, params.network],
        () => getProposalMilestones(params),
        options,
    )
}

// GET ONE

interface GetOneParams extends ProposalMilestonesApiParams {
    milestoneId: string
}

function getProposalMilestone({ proposalIndex, milestoneId, network }: GetOneParams) {
    return apiGet<ProposalMilestoneDto>(`${getApiBasePath(proposalIndex)}/${milestoneId}?network=${network}`)
}

export const PROPOSAL_MILESTONE_QUERY_KEY_BASE = 'proposalMilestone'

export const useGetProposalMilestone = (params: GetOneParams, options?: UseQueryOptions<ProposalMilestoneDto>) => {
    return useQuery(
        [PROPOSAL_MILESTONE_QUERY_KEY_BASE, params.proposalIndex, params.network, params.milestoneId],
        () => getProposalMilestone(params),
        options,
    )
}
