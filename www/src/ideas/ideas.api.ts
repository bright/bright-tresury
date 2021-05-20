import { apiGet, apiPost, apiPatch } from '../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IdeaDto } from './ideas.dto'

export const IDEAS_API_PATH = '/ideas'

// GET ALL

function getIdeas(network: string) {
    return apiGet<IdeaDto[]>(`${IDEAS_API_PATH}?network=${network}`)
}

export const useGetIdeas = (network: string, options?: UseQueryOptions<IdeaDto[]>) => {
    return useQuery(['ideas', network], () => getIdeas(network), options)
}

// GET ONE

function getIdea(ideaId: string) {
    return apiGet<IdeaDto>(`${IDEAS_API_PATH}/${ideaId}`)
}

export const useGetIdea = (ideaId: string, options?: UseQueryOptions<IdeaDto>) => {
    return useQuery(['idea', ideaId], () => getIdea(ideaId), options)
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

export interface TurnIdeaIntoProposalDto {
    ideaNetworkId: string
    extrinsicHash: string
    lastBlockHash: string
}

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
