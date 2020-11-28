import { API_URL, fetchAndUnwrap } from '../api'
import {KeyringAddress} from "@polkadot/ui-keyring/types";

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
