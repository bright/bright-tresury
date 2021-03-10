import {API_URL, apiGet, apiPost, apiPatch} from '../api'
import {ExtrinsicDetails} from "./SubmitProposalModal";

export interface IdeaNetworkDto {
    id?: string
    name: string
    value: number
}

export interface IdeaDto {
    id?: string
    title: string
    beneficiary: string
    field?: string
    content: string
    networks: IdeaNetworkDto[]
    contact?: string
    portfolio?: string
    links?: string[]
    status: IdeaStatus
    ordinalNumber: number
}

export enum IdeaStatus {
    Draft = 'draft',
    Active = 'active',
    TurnedIntoProposal = 'turned_into_proposal',
    Closed = 'closed',
}

export function doesIdeaBelongToUser(idea: IdeaDto) {
    /** TODO: adjust when authorization will be possible */
    return true
}

export function createEmptyIdea(network: string): IdeaDto {
    return {
        title: '',
        beneficiary: '',
        field: '',
        content: '',
        networks: [{name: network, value: 0} as IdeaNetworkDto],
        contact: '',
        portfolio: '',
        links: [''],
        status: IdeaStatus.Draft
    } as IdeaDto
}

const IdeaApiPath = `${API_URL}/ideas`

export function getIdeasByNetwork(networkName: string) {
    return apiGet<IdeaDto[]>(`${IdeaApiPath}?network=${networkName}`)
}

export function getIdeaById(id: string) {
    return apiGet<IdeaDto>(`${IdeaApiPath}/${id}`)
}

export function createIdea(idea: IdeaDto) {
    return apiPost<IdeaDto>(`${IdeaApiPath}`, idea)
}

export function updateIdea(idea: IdeaDto) {
    return apiPatch<IdeaDto>(`${IdeaApiPath}/${idea.id}`, idea)
}

export function convertIdeaToProposal(exDetails: ExtrinsicDetails, idea: IdeaDto, ideaNetwork: IdeaNetworkDto) {
    const data = {
        ideaNetworkId: ideaNetwork.id,
        extrinsicHash: exDetails.extrinsicHash,
        lastBlockHash: exDetails.lastBlockHash,
    }
    return apiPost<IdeaDto>(`${IdeaApiPath}/${idea.id}/proposals`, data)
}
