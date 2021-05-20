import { apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import {
    CreateIdeaMilestoneDto,
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    PatchIdeaMilestoneDto,
} from './idea.milestones.dto'
import { IDEAS_API_PATH } from '../../ideas.api'

// GET ALL

function getIdeaMilestones(ideaId: string) {
    return apiGet<IdeaMilestoneDto[]>(`${IDEAS_API_PATH}/${ideaId}/milestones`)
}

export const useGetIdeaMilestones = (ideaId: string, options?: UseQueryOptions<IdeaMilestoneDto[]>) => {
    return useQuery(['ideaMilestones', ideaId], () => getIdeaMilestones(ideaId), options)
}

// GET ONE

function getIdeaMilestone(ideaId: string, ideaMilestoneId: string) {
    return apiGet<IdeaMilestoneDto>(`${IDEAS_API_PATH}/${ideaId}/milestones/${ideaMilestoneId}`)
}

export const useGetIdeaMilestone = (
    ideaId: string,
    ideaMilestoneId: string,
    options?: UseQueryOptions<IdeaMilestoneDto>,
) => {
    return useQuery(
        ['ideaMilestone', ideaId, ideaMilestoneId],
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
    return apiPost<IdeaMilestoneDto>(`${IDEAS_API_PATH}/${ideaId}/milestones`, data)
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
    return apiPatch<IdeaMilestoneDto>(`${IDEAS_API_PATH}/${ideaId}/milestones/${ideaMilestoneId}`, data)
}

export const usePatchIdeaMilestone = () => {
    return useMutation(patchIdeaMilestone)
}

// TURN INTO PROPOSAL

export interface TurnIdeaMilestoneIntoProposalDto {
    ideaMilestoneNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}

export interface TurnIdeaMilestoneIntoProposalParams {
    ideaId: string
    ideaMilestoneId: string
    data: TurnIdeaMilestoneIntoProposalDto
}

function turnIdeaMilestoneIntoProposal({ ideaId, ideaMilestoneId, data }: TurnIdeaMilestoneIntoProposalParams) {
    return apiPost<IdeaMilestoneNetworkDto>(`${IDEAS_API_PATH}/${ideaId}/milestones/${ideaMilestoneId}/proposals`, data)
}

export const useTurnIdeaMilestoneIntoProposal = () => {
    return useMutation(turnIdeaMilestoneIntoProposal)
}
