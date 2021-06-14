import { apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import {
    CreateIdeaMilestoneDto,
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    PatchIdeaMilestoneDto,
    TurnIdeaMilestoneIntoProposalDto,
} from './idea.milestones.dto'
import { IDEAS_API_PATH } from '../../ideas.api'

const getIdeaMilestonesApiBasePath = (ideaId: string) => {
    return `${IDEAS_API_PATH}/${ideaId}/milestones`
}

// GET ALL

async function getIdeaMilestones(ideaId: string) {
    const result = await apiGet<IdeaMilestoneDto[]>(getIdeaMilestonesApiBasePath(ideaId))
    result.sort((a, b) => a.ordinalNumber - b.ordinalNumber)
    return result
}

export const IDEA_MILESTONES_QUERY_KEY_BASE = 'ideaMilestones'

export const useGetIdeaMilestones = (ideaId: string, options?: UseQueryOptions<IdeaMilestoneDto[]>) => {
    return useQuery([IDEA_MILESTONES_QUERY_KEY_BASE, ideaId], () => getIdeaMilestones(ideaId), options)
}

// GET ONE

function getIdeaMilestone(ideaId: string, ideaMilestoneId: string) {
    return apiGet<IdeaMilestoneDto>(`${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}`)
}

export const IDEA_MILESTONE_QUERY_KEY_BASE = 'ideaMilestone'

export const useGetIdeaMilestone = (
    ideaId: string,
    ideaMilestoneId: string,
    options?: UseQueryOptions<IdeaMilestoneDto>,
) => {
    return useQuery(
        [IDEA_MILESTONE_QUERY_KEY_BASE, ideaId, ideaMilestoneId],
        () => getIdeaMilestone(ideaId, ideaMilestoneId),
        options,
    )
}

// CREATE

export interface CreateIdeaMilestoneParams {
    ideaId: string
    data: CreateIdeaMilestoneDto
}

function createIdeaMilestone({ ideaId, data }: CreateIdeaMilestoneParams) {
    return apiPost<IdeaMilestoneDto>(`${getIdeaMilestonesApiBasePath(ideaId)}`, data)
}

export const useCreateIdeaMilestone = () => {
    return useMutation(createIdeaMilestone)
}

// PATCH

export interface PatchIdeaMilestoneParams {
    ideaId: string
    ideaMilestoneId: string
    data: PatchIdeaMilestoneDto
}

function patchIdeaMilestone({ ideaId, ideaMilestoneId, data }: PatchIdeaMilestoneParams) {
    return apiPatch<IdeaMilestoneDto>(`${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}`, data)
}

export const usePatchIdeaMilestone = () => {
    return useMutation(patchIdeaMilestone)
}

// TURN INTO PROPOSAL

export interface TurnIdeaMilestoneIntoProposalParams {
    ideaId: string
    ideaMilestoneId: string
    data: TurnIdeaMilestoneIntoProposalDto
}

function turnIdeaMilestoneIntoProposal({ ideaId, ideaMilestoneId, data }: TurnIdeaMilestoneIntoProposalParams) {
    return apiPost<IdeaMilestoneNetworkDto>(
        `${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}/proposals`,
        data,
    )
}

export const useTurnIdeaMilestoneIntoProposal = () => {
    return useMutation(turnIdeaMilestoneIntoProposal)
}
