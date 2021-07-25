import axios from 'axios'

const NODE_ENV = process.env.NODE_ENV
export const API_PREFIX = NODE_ENV === 'development' ? 'http://localhost:3001/' : '/'

export const API_URL = `${API_PREFIX}api/v1`

export const api = axios.create({
    baseURL: API_URL,
})

export function apiGet<T>(url: string) {
    return api.get<T>(url).then((response) => response.data)
}

export function apiPost<T>(url: string, data?: any) {
    console.log('apiPost, data:', data)
    return api.post<T>(url, data).then((response) => response.data)
}

export function apiPatch<T>(url: string, data: any) {
    return api.patch<T>(url, data).then((response) => response.data)
}

export function apiDelete<T>(url: string) {
    return api.delete<T>(url).then((response) => response.data)
}
