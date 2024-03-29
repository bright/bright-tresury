import axios, { AxiosRequestConfig } from 'axios'

const NODE_ENV = process.env.NODE_ENV

export const API_PREFIX = NODE_ENV === 'development' ? 'http://localhost:3001/' : '/'

export const API_URL = `${API_PREFIX}api/v1`

export const api = axios.create({
    baseURL: API_URL,
})

export function getUrlSearchParams(params: Object) {
    const searchParams = new URLSearchParams({})
    Object.entries(params).forEach(([key, value]) => {
        // backend controllers does not like empty/undefined/null values
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                const arraykey = key.endsWith('[]') ? key : `${key}[]`
                value.forEach((element) => {
                    searchParams.append(arraykey, element)
                })
            } else {
                searchParams.set(key, value)
            }
        }
    })
    return searchParams
}

export function apiGet<T>(url: string, config?: AxiosRequestConfig) {
    return api.get<T>(url, config).then((response) => response.data)
}

export function apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return api.post<T>(url, data, config).then((response) => response.data)
}

export function apiPatch<T>(url: string, data: any, config?: AxiosRequestConfig) {
    return api.patch<T>(url, data, config).then((response) => response.data)
}

export function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
    return api.delete<T>(url, config).then((response) => response.data)
}
