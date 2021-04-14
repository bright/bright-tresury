import {SignInAPIResponse, SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {SendVerifyEmailAPIResponse, VerifyEmailAPIResponse} from "supertokens-auth-react/lib/build/recipe/emailverification/types";
import {apiPost, apiGet} from "../api";
import {transformSignInRequestData, transformSignUpRequestData} from "./supertokens.utils/transformRequestData.utils";

export interface SignUpData {
    email: string
    password: string
    username: string
}

export interface SignInData {
    email: string
    password: string
}

export function signUp(data: SignUpData) {
    const requestData = transformSignUpRequestData(data)

    return apiPost<SignUpAPIResponse | SendVerifyEmailAPIResponse>( `/signup`, requestData).then((result) => {
        if (result.status === "OK") {
            return sendVerifyEmail()
        } else {
            return result
        }
    })
}

export function sendVerifyEmail() {
    return apiPost<SendVerifyEmailAPIResponse>('/user/email/verify/token')
}

export function verifyEmail(token: string) {
    const data = {
        method: "token",
        token
    }
    return apiPost<VerifyEmailAPIResponse>('/user/email/verify', data)
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

export interface CreateBlockchainUserDto {
    address: string
    token: string
    username: string
}

export function blockchainSignUp(user: CreateBlockchainUserDto) {
    return apiPost<any>(`/auth/blockchain/signup`, user)
}

export interface RegisterBlockchainTokenDto {
    token: string
}

export function blockchainRegisterToken(registerToken: RegisterBlockchainTokenDto): Promise<void> {
    return apiPost<any>(`/auth/blockchain/register-token`, registerToken)
}
