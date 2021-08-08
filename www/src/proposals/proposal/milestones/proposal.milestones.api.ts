import { useQuery, UseQueryOptions } from 'react-query'
import { apiGet } from '../../../api'
import { PROPOSALS_API_PATH } from '../../proposals.api'
import { ProposalMilestoneDto } from './proposal.milestones.dto'

const getApiBasePath = (proposalIndex: number) => {
    return `${PROPOSALS_API_PATH}/${proposalIndex}/milestones`
}

// GET ALL

async function getProposalMilestones(proposalIndex: number, network: string) {
    const result = await apiGet<ProposalMilestoneDto[]>(`${getApiBasePath(proposalIndex)}?network=${network}`)
    result.sort((a, b) => a.ordinalNumber - b.ordinalNumber)
    return result
}

export const PROPOSAL_MILESTONES_QUERY_KEY_BASE = 'proposalMilestones'

interface GetProposalMilestoneParams {
    proposalIndex: number
    network: string
}

export const useGetProposalMilestones = (
    { proposalIndex, network }: GetProposalMilestoneParams,
    options?: UseQueryOptions<ProposalMilestoneDto[]>,
) => {
    return useQuery(
        [PROPOSAL_MILESTONES_QUERY_KEY_BASE, proposalIndex, network],
        () => getProposalMilestones(proposalIndex, network),
        options,
    )
}

// GET ONE

function getProposalMilestone(proposalIndex: number, milestoneId: string) {
    return apiGet<ProposalMilestoneDto>(`${getApiBasePath(proposalIndex)}/${milestoneId}`)
}

export const PROPOSAL_MILESTONE_QUERY_KEY_BASE = 'proposalMilestone'

export const useGetIdeaMilestone = (
    proposalIndex: number,
    milestoneId: string,
    options?: UseQueryOptions<ProposalMilestoneDto>,
) => {
    return useQuery(
        [PROPOSAL_MILESTONE_QUERY_KEY_BASE, proposalIndex, milestoneId],
        () => getProposalMilestone(proposalIndex, milestoneId),
        options,
    )
}
