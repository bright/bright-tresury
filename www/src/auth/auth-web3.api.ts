import {apiPost} from "../api";

export interface Web3SignStartResponse {
    signMessage: string
}

export interface ConfirmBlockchainSignDto {
    address: string
    signature: string
}

export interface ConfirmBlockchainSignUpDto extends ConfirmBlockchainSignDto {
    network: string
}

export function startWeb3SignUp(address: string): Promise<Web3SignStartResponse> {
    return apiPost<Web3SignStartResponse>(`/auth/web3/signup/start`, {address})
}

export function confirmWeb3SignUp(address: ConfirmBlockchainSignUpDto): Promise<void> {
    return apiPost<void>(`/auth/web3/signup/confirm`, address)
}

export function startWeb3SignIn(address: string): Promise<Web3SignStartResponse> {
    return apiPost<Web3SignStartResponse>(`/auth/web3/signin/start`, {address})
}

export function confirmWeb3SignIn(address: ConfirmBlockchainSignDto): Promise<void> {
    return apiPost<void>(`/auth/web3/signin/confirm`, address)
}
