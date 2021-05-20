import { apiGet, apiPost, apiPatch } from '../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IdeaDto } from './ideas.dto'

// GET ALL

export function getIdeas(network: string) {
    return apiGet<IdeaDto[]>(`/ideas?network=${network}`)
}

export const useGetIdeas = (network: string, options?: UseQueryOptions<IdeaDto[]>) => {
    return useQuery(['ideas', network], () => getIdeas(network), options)
}

// GET ONE

export function getIdea(ideaId: string) {
    return apiGet<IdeaDto>(`/ideas/${ideaId}`)
}

export const useGetIdea = (ideaId: string, options?: UseQueryOptions<IdeaDto>) => {
    return useQuery(['idea', ideaId], () => getIdea(ideaId), options)
}

// CREATE

export function createIdea(idea: IdeaDto) {
    return apiPost<IdeaDto>(`/ideas`, idea)
}

export const useCreateIdea = () => {
    return useMutation(createIdea)
}

// PATCH

export function patchIdea(idea: IdeaDto) {
    return apiPatch<IdeaDto>(`/ideas/${idea.id}`, idea)
}

export const usePatchIdea = () => {
    return useMutation(patchIdea)
}

// TURN INTO PROPOSAL

export interface TurnIdeaIntoProposalDto {
    ideaNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}

export interface TurnIdeaIntoProposalParams {
    ideaId: string
    data: TurnIdeaIntoProposalDto
}

export function turnIdeaIntoProposal({ ideaId, data }: TurnIdeaIntoProposalParams) {
    return apiPost<IdeaDto>(`/ideas/${ideaId}/proposals`, data)
}

export const useTurnIdeaIntoProposal = () => {
    return useMutation(turnIdeaIntoProposal)
}
