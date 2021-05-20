import { apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import {
    CreateIdeaMilestoneDto,
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    PatchIdeaMilestoneDto,
} from './idea.milestones.dto'

// GET ALL

export function getIdeaMilestones(ideaId: string) {
    return apiGet<IdeaMilestoneDto[]>(`/ideas/${ideaId}/milestones`)
}

export const useGetIdeaMilestones = (ideaId: string, options?: UseQueryOptions<IdeaMilestoneDto[]>) => {
    return useQuery(['ideaMilestones', ideaId], () => getIdeaMilestones(ideaId), options)
}

// GET ONE

export function getIdeaMilestone(ideaId: string, ideaMilestoneId: string) {
    return apiGet<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}`)
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

export function createIdeaMilestone({ ideaId, data }: CreateIdeaMilestoneParams) {
    return apiPost<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones`, data)
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

export function patchIdeaMilestone({ ideaId, ideaMilestoneId, data }: PatchIdeaMilestoneParams) {
    return apiPatch<IdeaMilestoneDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}`, data)
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

export function turnIdeaMilestoneIntoProposal({ ideaId, ideaMilestoneId, data }: TurnIdeaMilestoneIntoProposalParams) {
    return apiPost<IdeaMilestoneNetworkDto>(`/ideas/${ideaId}/milestones/${ideaMilestoneId}/proposals`, data)
}

export const useTurnIdeaMilestoneIntoProposal = () => {
    return useMutation(turnIdeaMilestoneIntoProposal)
}
