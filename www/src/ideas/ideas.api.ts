import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import { apiDelete, apiGet, apiPatch, apiPost } from '../api'
import { IdeaProposalDetailsDto } from '../idea-proposal-details/idea-proposal-details.dto'
import {
    EditIdeaDto,
    EditIdeaNetworkDto,
    EditSingleIdeaNetworkDto,
    IdeaDto,
    IdeaNetworkDto,
    IdeaNetworkStatus,
    IdeaStatus,
    TurnIdeaIntoProposalDto,
} from './ideas.dto'
import { NetworkPlanckValue } from '../util/types'
import { AuthorDto } from '../util/author.dto'

export const IDEAS_API_PATH = '/ideas'

interface ApiIdeaDto {
    id: string
    ordinalNumber: number
    beneficiary: string
    networks: IdeaNetworkDto[]
    status: IdeaStatus
    owner: AuthorDto
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
        status:
            apiIdea.status === IdeaStatus.TurnedIntoProposal &&
            currentNetwork.status !== IdeaNetworkStatus.TurnedIntoProposal
                ? IdeaStatus.Pending
                : apiIdea.status,
    }
}

export interface ApiEditIdeaDto {
    id?: string
    beneficiary?: string
    networks?: EditIdeaNetworkDto[]
    status?: IdeaStatus
    details?: IdeaProposalDetailsDto
}

type ApiEditIdeaNetworkDto = Omit<EditIdeaNetworkDto, 'value'> & { value: NetworkPlanckValue }

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

// PATCH idea network

interface PatchIdeaNetworkParams {
    ideaNetwork: EditSingleIdeaNetworkDto
    ideaId: string
}

function patchIdeaNetwork({ ideaNetwork: { id, value }, ideaId }: PatchIdeaNetworkParams): Promise<IdeaNetworkDto> {
    return apiPatch<IdeaNetworkDto>(`${IDEAS_API_PATH}/${ideaId}/networks/${id}`, { value })
}

export const usePatchIdeaNetwork = () => {
    return useMutation(patchIdeaNetwork)
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

// DELETE IDEA

export interface DeleteIdea {
    ideaId: string
}

function deleteIdea({ ideaId }: DeleteIdea): Promise<void> {
    return apiDelete(`${IDEAS_API_PATH}/${ideaId}`)
}

export const useDeleteIdea = () => {
    return useMutation(deleteIdea)
}
