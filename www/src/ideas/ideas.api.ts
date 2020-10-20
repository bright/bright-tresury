import { API_URL, fetchAndUnwrap } from '../api'

export interface IdeaNetworkResponse {
    id: string
    name: string
    value: number
}

export interface IdeaResponse {
    id: string
    title: string
    content: string
    networks: IdeaNetworkResponse
}

export function getIdeasByNetwork(name: string) {
    return fetchAndUnwrap<IdeaResponse[]>('GET', `${API_URL}/ideas?network=${name}`)
}

export function getIdeasById(id: string) {
    return fetchAndUnwrap<IdeaResponse>('GET', `${API_URL}/ideas/${id}`)
}