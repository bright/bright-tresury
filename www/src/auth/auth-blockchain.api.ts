import {apiPost} from "../api";

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

export function confirmAddressSignUp(address: ConfirmBlockchainSignUpRequest): Promise<void> {
    return apiPost<void>(`/auth/blockchain/signup/confirm`, address)
}
