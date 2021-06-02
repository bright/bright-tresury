import {useMutation} from "react-query";
import {apiPost} from "../../../api";
import {ConfirmWeb3SignRequestDto, handleWeb3Sign, StartWeb3SignRequestDto, StartWeb3SignResponseDto} from "../../handleWeb3Sign";
import {Web3SignInValues} from "./Web3SignIn";

function startWeb3SignIn(dto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/web3/signin/start`, dto)
}

function confirmWeb3SignIn(dto: ConfirmWeb3SignRequestDto): Promise<void> {
    return apiPost<void>(`/auth/web3/signin/confirm`, dto)
}

function handleWeb3SignIn(dto: Web3SignInValues) {
    return handleWeb3Sign(dto.account, startWeb3SignIn, confirmWeb3SignIn)
}

export const useWeb3SignIn = () => {
    return useMutation(handleWeb3SignIn)
}
