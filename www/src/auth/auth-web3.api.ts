import {apiPost} from "../api";

export interface StartBlockchainSignUpResponse {
    message: string
    signMessage: string
}

export function startAddressSignUp(address: string): Promise<StartBlockchainSignUpResponse> {
    return apiPost<StartBlockchainSignUpResponse>(`/auth/web3/signup/start`, {address})
}

export interface ConfirmBlockchainSignUpDto {
    network: string
    address: string
    signature: string
}

export function confirmAddressSignUp(address: ConfirmBlockchainSignUpDto): Promise<void> {
    return apiPost<void>(`/auth/web3/signup/confirm`, address)
}
