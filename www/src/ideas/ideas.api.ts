import { apiGet, apiPost, apiPatch } from '../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IdeaDto, TurnIdeaIntoProposalDto } from './ideas.dto'
import { IdeaCommentDto } from './idea/discussion/IdeaComment.dto'
import { IDEA_MILESTONE_QUERY_KEY_BASE } from './idea/milestones/idea.milestones.api'

export const IDEAS_API_PATH = '/ideas'

// GET ALL

function getIdeas(network: string) {
    return apiGet<IdeaDto[]>(`${IDEAS_API_PATH}?network=${network}`)
}

export const IDEAS_QUERY_KEY_BASE = 'ideas'

export const useGetIdeas = (network: string, options?: UseQueryOptions<IdeaDto[]>) => {
    return useQuery([IDEAS_QUERY_KEY_BASE, network], () => getIdeas(network), options)
}

// GET ONE

function getIdea(ideaId: string) {
    return apiGet<IdeaDto>(`${IDEAS_API_PATH}/${ideaId}`)
}

export const IDEA_QUERY_KEY_BASE = 'idea'

export const useGetIdea = (ideaId: string, options?: UseQueryOptions<IdeaDto>) => {
    return useQuery([IDEA_QUERY_KEY_BASE, ideaId], () => getIdea(ideaId), options)
}

// CREATE

function createIdea(idea: IdeaDto) {
    return apiPost<IdeaDto>(`${IDEAS_API_PATH}`, idea)
}

export const useCreateIdea = () => {
    return useMutation(createIdea)
}

// PATCH

function patchIdea(idea: IdeaDto) {
    return apiPatch<IdeaDto>(`${IDEAS_API_PATH}/${idea.id}`, idea)
}

export const usePatchIdea = () => {
    return useMutation(patchIdea)
}

// TURN INTO PROPOSAL

export interface TurnIdeaIntoProposalParams {
    ideaId: string
    data: TurnIdeaIntoProposalDto
}

function turnIdeaIntoProposal({ ideaId, data }: TurnIdeaIntoProposalParams) {
    return apiPost<IdeaDto>(`${IDEAS_API_PATH}/${ideaId}/proposals`, data)
}

export const useTurnIdeaIntoProposal = () => {
    return useMutation(turnIdeaIntoProposal)
}
