import {API_URL} from '../api'
import {ExtrinsicDetails} from "./SubmitProposalModal";
import api from '../api';

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
    return api.get<IdeaDto[]>(`${IdeaApiPath}?network=${networkName}`).then((response) => response.data)
}

export function getIdeaById(id: string) {
    return api.get<IdeaDto>(`${IdeaApiPath}/${id}`).then((response) => response.data)
}

export function createIdea(idea: IdeaDto) {
    return api.post<IdeaDto>(`${IdeaApiPath}`, idea).then((response) => response.data)
}

export function updateIdea(idea: IdeaDto) {
    return api.patch<IdeaDto>(`${IdeaApiPath}/${idea.id}`, idea).then((response) => response.data)
}

export function convertIdeaToProposal(exDetails: ExtrinsicDetails, idea: IdeaDto, ideaNetwork: IdeaNetworkDto) {
    const data = {
        ideaNetworkId: ideaNetwork.id,
        extrinsicHash: exDetails.extrinsicHash,
        lastBlockHash: exDetails.lastBlockHash,
    }
    return api.post<IdeaDto>(`${IdeaApiPath}/${idea.id}/proposals`, data)
}
