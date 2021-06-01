import {apiGet, apiPost} from '../api'

export function signOut() {
    return apiPost(`/signout`)
}

export function getSessionData() {
    return apiGet<any>(`/auth/session`)
}
