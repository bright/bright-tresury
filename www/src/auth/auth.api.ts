import {SignInAPIResponse, SignUpAPIResponse} from 'supertokens-auth-react/lib/build/recipe/emailpassword/types';
import {API_URL, apiPost, apiGet} from "../api";
import {transformSignInRequestData, transformSignUpRequestData} from "./supertokens.utils";

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
    return apiPost<SignUpAPIResponse>( `${API_URL}/signup`, requestData)
}

export function signIn(data: SignInData) {
    const requestData = transformSignInRequestData(data)
    return apiPost<SignInAPIResponse>(`${API_URL}/signin`, requestData)
}

export function signOut() {
    return apiPost(`${API_URL}/signout`)
}

export function getSessionData() {
    return apiGet<any>(`${API_URL}/auth/session`)
}

export interface CreateBlockchainUserDto {
    address: string
    token: string
    username: string
}

export function blockchainSignUp(user: CreateBlockchainUserDto) {
    return apiPost<any>(`${API_URL}/auth/blockchain/signup`, user)
}

export interface RegisterBlockchainTokenDto {
    token: string
}

export function blockchainRegisterToken(registerToken: RegisterBlockchainTokenDto): Promise<void> {
    return apiPost<any>(`${API_URL}/auth/blockchain/register-token`, registerToken)
}
