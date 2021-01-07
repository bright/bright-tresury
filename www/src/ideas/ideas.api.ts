import {API_URL, fetchAndUnwrap} from '../api'
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
    } as IdeaDto
}

export function getIdeasByNetwork(name: string) {
    return fetchAndUnwrap<IdeaDto[]>('GET', `${API_URL}/ideas?network=${name}`)
}

export function getIdeaById(id: string) {
    return fetchAndUnwrap<IdeaDto>('GET', `${API_URL}/ideas/${id}`)
}

export function createIdea(idea: IdeaDto) {
    return fetchAndUnwrap<IdeaDto>('POST', `${API_URL}/ideas`, idea)
}

export function convertIdeaToProposal(exDetails: ExtrinsicDetails, idea: IdeaDto, ideaNetwork: IdeaNetworkDto) {
    const data = {
        ideaNetworkId: ideaNetwork.id,
        extrinsicHash: exDetails.extrinsicHash,
        lastBlockHash: exDetails.lastBlockHash,
    }
    return fetchAndUnwrap<IdeaDto>('POST', `${API_URL}/ideas/${idea.id}/proposals`, data)
}
