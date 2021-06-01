import {SendVerifyEmailAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailverification/types'
import {apiGet, apiPost} from '../api'

export function sendVerifyEmail() {
    return apiPost<SendVerifyEmailAPIResponse>('/user/email/verify/token')
}

export function verifyEmail(token: string) {
    return apiPost<void>(`/auth/email-password/verify/${token}`)
}


export function signOut() {
    return apiPost(`/signout`)
}

export function getSessionData() {
    return apiGet<any>(`/auth/session`)
}
