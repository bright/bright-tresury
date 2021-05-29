import { SignInAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailpassword/types'
import { SendVerifyEmailAPIResponse } from 'supertokens-auth-react/lib/build/recipe/emailverification/types'
import { apiGet, apiPost } from '../api'
import { transformSignInRequestData } from './supertokens.utils/transformRequestData.utils'

export interface SignInData {
    email: string
    password: string
}

export function sendVerifyEmail() {
    return apiPost<SendVerifyEmailAPIResponse>('/user/email/verify/token')
}

export function verifyEmail(token: string) {
    return apiPost<void>(`/auth/email-password/verify/${token}`)
}

export function signIn(data: SignInData) {
    const requestData = transformSignInRequestData(data)
    return apiPost<SignInAPIResponse>(`/signin`, requestData)
}

export function signOut() {
    return apiPost(`/signout`)
}

export function getSessionData() {
    return apiGet<any>(`/auth/session`)
}
