import {API_URL, fetchAndUnwrap} from '../api'
import {ExtrinsicDetails} from "./SubmitProposalModal";

export interface IdeaNetwork {
    id?: string
    name: string
    value: number
}

export interface Idea {
    id?: string
    title: string
    beneficiary: string
    field?: string
    content: string
    networks: IdeaNetwork[]
    contact?: string
    portfolio?: string
    links?: string[]
}

export function getIdeasByNetwork(name: string) {
    return fetchAndUnwrap<Idea[]>('GET', `${API_URL}/ideas?network=${name}`)
}

export function getIdeaById(id: string) {
    return fetchAndUnwrap<Idea>('GET', `${API_URL}/ideas/${id}`)
}

export function createIdea(idea: Idea) {
    return fetchAndUnwrap<Idea>('POST', `${API_URL}/ideas`, idea)
}

export function convertIdeaToProposal(exDetails: ExtrinsicDetails, idea: Idea, ideaNetwork: IdeaNetwork) {
    const data = {
        ideaNetworkId: ideaNetwork.id,
        extrinsicHash: exDetails.extrinsicHash,
        lastBlockHash: exDetails.lastBlockHash,
    }
    return fetchAndUnwrap<Idea>('POST', `${API_URL}/ideas/${idea.id}/proposals`, data)
}
