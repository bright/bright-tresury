import { API_URL, fetchAndUnwrap } from '../api'

export interface IdeaNetwork {
    id?: string
    name: string
    value: number
}

export interface Idea {
    id?: string
    title: string
    content: string
    networks: IdeaNetwork[]
}

export function getIdeasByNetwork(name: string) {
    return fetchAndUnwrap<Idea[]>('GET', `${API_URL}/ideas?network=${name}`)
}

export function getIdeasById(id: string) {
    return fetchAndUnwrap<Idea>('GET', `${API_URL}/ideas/${id}`)
}

export function createIdea(idea: Idea) {
    return fetchAndUnwrap<Idea>('POST', `${API_URL}/ideas`, idea)
}