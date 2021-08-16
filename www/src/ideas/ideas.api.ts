import { apiGet, apiPost, apiPatch } from '../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import {
    EditIdeaDto,
    EditIdeaNetworkDto,
    IdeaDto,
    IdeaNetworkDto,
    IdeaStatus,
    TurnIdeaIntoProposalDto,
} from './ideas.dto'

export const IDEAS_API_PATH = '/ideas'

interface ApiIdeaDto {
    id: string
    ordinalNumber: number
    beneficiary: string
    networks: IdeaNetworkDto[]
    status: IdeaStatus
    ownerId: string
    details: IdeaProposalDetailsDto
}

function toIdeaDto(apiIdea: ApiIdeaDto, networkId: string): IdeaDto {
    const currentNetwork = apiIdea.networks.find((n) => n.name === networkId)
    if (!currentNetwork) {
        throw new Error()
    }
    return {
        ...apiIdea,
        currentNetwork,
        additionalNetworks: apiIdea.networks.filter((n) => n.name !== networkId),
    }
}

export interface ApiEditIdeaDto {
    id?: string
    beneficiary?: string
    networks?: EditIdeaNetworkDto[]
    status?: IdeaStatus
    details?: IdeaProposalDetailsDto
}

function toApiEditIdeaDto(idea: EditIdeaDto): ApiEditIdeaDto {
    return {
        ...idea,
        networks: [...idea.additionalNetworks, idea.currentNetwork],
    }
}

// GET ALL

async function getIdeas(network: string): Promise<IdeaDto[]> {
    const ideas = await apiGet<ApiIdeaDto[]>(`${IDEAS_API_PATH}?network=${network}`)
    return ideas.map((idea) => toIdeaDto(idea, network))
}

export const IDEAS_QUERY_KEY_BASE = 'ideas'

export const useGetIdeas = (network: string, options?: UseQueryOptions<IdeaDto[]>) => {
    return useQuery([IDEAS_QUERY_KEY_BASE, network], () => getIdeas(network), options)
}

// GET ONE

async function getIdea(ideaId: string, network: string): Promise<IdeaDto> {
    const idea = await apiGet<ApiIdeaDto>(`${IDEAS_API_PATH}/${ideaId}`)
    return toIdeaDto(idea, network)
}

export const IDEA_QUERY_KEY_BASE = 'idea'

export const useGetIdea = (
    { ideaId, network }: { ideaId: string; network: string },
    options?: UseQueryOptions<IdeaDto>,
) => {
    return useQuery([IDEA_QUERY_KEY_BASE, ideaId], () => getIdea(ideaId, network), options)
}

// CREATE

async function createIdea(idea: EditIdeaDto) {
    const data = toApiEditIdeaDto(idea)
    const result = await apiPost<ApiIdeaDto>(`${IDEAS_API_PATH}`, data)
    return toIdeaDto(result, idea.currentNetwork.name)
}

export const useCreateIdea = () => {
    return useMutation(createIdea)
}

// PATCH

async function patchIdea(idea: EditIdeaDto) {
    const data = toApiEditIdeaDto(idea)
    const result = await apiPatch<ApiIdeaDto>(`${IDEAS_API_PATH}/${idea.id}`, data)
    return toIdeaDto(result, idea.currentNetwork.name)
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
    return apiPost(`${IDEAS_API_PATH}/${ideaId}/proposals`, data)
}

export const useTurnIdeaIntoProposal = () => {
    return useMutation(turnIdeaIntoProposal)
}
