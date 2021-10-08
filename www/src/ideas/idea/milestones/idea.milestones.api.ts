import { apiDelete, apiGet, apiPatch, apiPost } from '../../../api'
import { useMutation, useQuery, UseQueryOptions } from 'react-query'
import {
    CreateIdeaMilestoneDto,
    IdeaMilestoneDto,
    IdeaMilestoneNetworkDto,
    IdeaMilestoneStatus,
    PatchIdeaMilestoneDto,
    TurnIdeaMilestoneIntoProposalDto,
    UpdateIdeaMilestoneNetworksDto,
} from './idea.milestones.dto'
import { IDEAS_API_PATH } from '../../ideas.api'
import { Nil } from '../../../util/types'
import { MilestoneDetailsDto } from '../../../milestone-details/milestone-details.dto'

interface ApiIdeaMilestoneDto {
    id: string
    ordinalNumber: number
    status: IdeaMilestoneStatus
    beneficiary: Nil<string>
    networks: IdeaMilestoneNetworkDto[]
    details: MilestoneDetailsDto
}
const getIdeaMilestonesApiBasePath = (ideaId: string) => {
    return `${IDEAS_API_PATH}/${ideaId}/milestones`
}

const toIdeaMilestoneDto = (apiIdeaMilestoneDto: ApiIdeaMilestoneDto, currentNetwork: string): IdeaMilestoneDto => {
    const currentNetworkIdeaMilestoneNetworkDto = apiIdeaMilestoneDto.networks.find(
        (network) => network.name === currentNetwork,
    )!
    const additionalNetworksIdeaMilestoneNetworkDto = apiIdeaMilestoneDto.networks.filter(
        (network) => network.name !== currentNetwork,
    )
    return {
        ...apiIdeaMilestoneDto,
        currentNetwork: currentNetworkIdeaMilestoneNetworkDto,
        additionalNetworks: additionalNetworksIdeaMilestoneNetworkDto,
    }
}
interface WithCurrentAndAdditionalNetworks {
    currentNetwork?: IdeaMilestoneNetworkDto
    additionalNetworks?: IdeaMilestoneNetworkDto[]
}
const getNetworksFromIdeaMilestoneDto = (
    ideaMilestone: WithCurrentAndAdditionalNetworks,
): IdeaMilestoneNetworkDto[] => {
    return [
        ...(ideaMilestone.currentNetwork ? [ideaMilestone.currentNetwork] : []),
        ...(ideaMilestone.additionalNetworks ?? []),
    ]
}

// GET ALL

async function getIdeaMilestones(ideaId: string, currentNetwork: string) {
    const ideaMilestones = await apiGet<ApiIdeaMilestoneDto[]>(getIdeaMilestonesApiBasePath(ideaId))
    ideaMilestones.sort((a, b) => a.ordinalNumber - b.ordinalNumber)
    return ideaMilestones.map((ideaMilestone) => toIdeaMilestoneDto(ideaMilestone, currentNetwork))
}

export const IDEA_MILESTONES_QUERY_KEY_BASE = 'ideaMilestones'

export const useGetIdeaMilestones = (
    ideaId: string,
    currentNetwork: string,
    options?: UseQueryOptions<IdeaMilestoneDto[]>,
) => {
    return useQuery([IDEA_MILESTONES_QUERY_KEY_BASE, ideaId], () => getIdeaMilestones(ideaId, currentNetwork), options)
}

// GET ONE

async function getIdeaMilestone(ideaId: string, ideaMilestoneId: string, currentNetwork: string) {
    const apiIdeaMilestoneDto: ApiIdeaMilestoneDto = await apiGet<ApiIdeaMilestoneDto>(
        `${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}`,
    )
    return toIdeaMilestoneDto(apiIdeaMilestoneDto, currentNetwork)
}

export const IDEA_MILESTONE_QUERY_KEY_BASE = 'ideaMilestone'

export const useGetIdeaMilestone = (
    ideaId: string,
    ideaMilestoneId: string,
    currentNetwork: string,
    options?: UseQueryOptions<IdeaMilestoneDto>,
) => {
    return useQuery(
        [IDEA_MILESTONE_QUERY_KEY_BASE, ideaId, ideaMilestoneId],
        () => getIdeaMilestone(ideaId, ideaMilestoneId, currentNetwork),
        options,
    )
}

// CREATE

export interface CreateIdeaMilestoneParams {
    ideaId: string
    data: CreateIdeaMilestoneDto
}

function createIdeaMilestone({ ideaId, data }: CreateIdeaMilestoneParams) {
    const apiDto = { ...data, networks: getNetworksFromIdeaMilestoneDto(data) }
    return apiPost<ApiIdeaMilestoneDto>(`${getIdeaMilestonesApiBasePath(ideaId)}`, apiDto)
}

export const useCreateIdeaMilestone = () => {
    return useMutation(createIdeaMilestone)
}

// PATCH

export interface PatchIdeaMilestoneParams {
    ideaId: string
    ideaMilestoneId: string
    currentNetwork: string
    data: PatchIdeaMilestoneDto
}

async function patchIdeaMilestone({ ideaId, ideaMilestoneId, currentNetwork, data }: PatchIdeaMilestoneParams) {
    const apiDto = { ...data, networks: getNetworksFromIdeaMilestoneDto(data) }
    const apiIdeaMilestone = await apiPatch<ApiIdeaMilestoneDto>(
        `${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}`,
        apiDto,
    )
    return toIdeaMilestoneDto(apiIdeaMilestone, currentNetwork)
}

export const usePatchIdeaMilestone = () => {
    return useMutation(patchIdeaMilestone)
}

export interface PatchIdeaMilestoneNetworksParams {
    ideaId: string
    ideaMilestoneId: string
    data: UpdateIdeaMilestoneNetworksDto
}

const patchIdeaMilestoneNetworks = ({ ideaId, ideaMilestoneId, data }: PatchIdeaMilestoneNetworksParams) =>
    apiPatch<IdeaMilestoneNetworkDto[]>(`${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}/networks`, data)

export const usePatchIdeaMilestoneNetworks = () => useMutation(patchIdeaMilestoneNetworks)

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

// DELETE IDEA MILESTONE

export interface DeleteIdeaMilestone {
    ideaMilestoneId: string
    ideaId: string
}

function deleteIdeaMilestone({ ideaMilestoneId, ideaId }: DeleteIdeaMilestone): Promise<void> {
    return apiDelete(`${getIdeaMilestonesApiBasePath(ideaId)}/${ideaMilestoneId}`)
}

export const useDeleteIdeaMilestone = () => {
    return useMutation(deleteIdeaMilestone)
}
