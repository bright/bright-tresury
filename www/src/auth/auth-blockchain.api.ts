import {apiPost} from "../api";

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

export interface StartBlockchainSignUpResponse {
    message: string
    signMessage: string
}

export function startAddressSignUp(address: string): Promise<StartBlockchainSignUpResponse> {
    return apiPost<StartBlockchainSignUpResponse>(`/auth/blockchain/signup/start`, {address})
}

export interface ConfirmBlockchainSignUpRequest {
    network: string
    address: string
    signature: string
}

export interface ConfirmBlockchainSignUpResponse {
    token?: string
}

export function confirmAddressSignUp(address: ConfirmBlockchainSignUpRequest): Promise<ConfirmBlockchainSignUpResponse> {
    return apiPost<ConfirmBlockchainSignUpResponse>(`/auth/blockchain/signup/confirm`, address)
}
