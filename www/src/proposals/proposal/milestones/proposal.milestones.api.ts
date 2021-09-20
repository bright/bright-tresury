import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiDelete, apiGet, apiPatch, apiPost } from '../../../api'
import { ApiMilestoneDetailsDto, toMilestoneDetailsDto } from '../../../milestone-details/milestone-details.dto'
import { PROPOSALS_API_PATH } from '../../proposals.api'
import { CreateProposalMilestoneDto, ProposalMilestoneDto, UpdateProposalMilestoneDto } from './proposal.milestones.dto'

const getApiBasePath = (proposalIndex: number, network: string, milestoneId: string = '') => {
    return `${PROPOSALS_API_PATH}/${proposalIndex}/milestones/${milestoneId}?network=${network}`
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
    const result = await apiGet<ApiProposalMilestoneDto[]>(getApiBasePath(proposalIndex, network))
    return result.map((milestone) => {
        return {
            ...milestone,
            details: toMilestoneDetailsDto(milestone.details),
        }
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

interface GetOneProposalMilestonesApiParams extends ProposalMilestonesApiParams {
    milestoneId: string
}

function getProposalMilestone({ proposalIndex, milestoneId, network }: GetOneProposalMilestonesApiParams) {
    return apiGet<ProposalMilestoneDto>(getApiBasePath(proposalIndex, network, milestoneId))
}

export const PROPOSAL_MILESTONE_QUERY_KEY_BASE = 'proposalMilestone'

export const useGetProposalMilestone = (
    params: GetOneProposalMilestonesApiParams,
    options?: UseQueryOptions<ProposalMilestoneDto>,
) => {
    return useQuery(
        [PROPOSAL_MILESTONE_QUERY_KEY_BASE, params.proposalIndex, params.network, params.milestoneId],
        () => getProposalMilestone(params),
        options,
    )
}

// CREATE

export interface PostProposalMilestonesApiParams extends ProposalMilestonesApiParams {
    data: CreateProposalMilestoneDto
}

function createProposalMilestone({ proposalIndex, network, data }: PostProposalMilestonesApiParams) {
    return apiPost<ProposalMilestoneDto>(getApiBasePath(proposalIndex, network), data)
}

export const useCreateProposalMilestone = () => {
    return useMutation(createProposalMilestone)
}

// PATCH

export interface PatchProposalMilestonesApiParams extends ProposalMilestonesApiParams {
    milestoneId: string
    data: UpdateProposalMilestoneDto
}

function patchProposalMilestone({ proposalIndex, network, milestoneId, data }: PatchProposalMilestonesApiParams) {
    return apiPatch<ProposalMilestoneDto>(getApiBasePath(proposalIndex, network, milestoneId), data)
}

export const usePatchProposalMilestone = () => {
    return useMutation(patchProposalMilestone)
}

// DELETE

export interface DeleteProposalMilestonesApiParams extends ProposalMilestonesApiParams {
    milestoneId: string
}

function deleteProposalMilestone({ proposalIndex, network, milestoneId }: DeleteProposalMilestonesApiParams) {
    return apiDelete<ProposalMilestoneDto>(getApiBasePath(proposalIndex, network, milestoneId))
}

export const useDeleteProposalMilestone = () => {
    return useMutation(deleteProposalMilestone)
}
