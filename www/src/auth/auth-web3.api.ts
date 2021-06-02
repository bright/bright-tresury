import {apiPost} from "../api";
import {ConfirmWeb3SignRequestDto, StartWeb3SignRequestDto, StartWeb3SignResponseDto} from "./handleWeb3Sign";

export function startWeb3SignIn(dto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/web3/signin/start`, dto)
}

export function confirmWeb3SignIn(dto: ConfirmWeb3SignRequestDto): Promise<void> {
    return apiPost<void>(`/auth/web3/signin/confirm`, dto)
}
