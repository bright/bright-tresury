import { useMutation } from 'react-query'
import { apiPost } from '../api'
import {
    ConfirmWeb3SignRequestDto,
    handleWeb3Sign,
    StartWeb3SignRequestDto,
    StartWeb3SignResponseDto,
} from '../auth/handleWeb3Sign'

// TODO add endpoints in backend and call them endpoints - TREAS-386

function startPolkassemblyShare(dto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
    return apiPost(`/polkassembly/share/start`, dto)
}

function confirmPolkassemblyShare(dto: ConfirmWeb3SignRequestDto): Promise<void> {
    return apiPost<void>(`/polkassembly/share/confirm`, dto)
}

function handlePolkassemblyShare(dto: { account: string }) {
    return handleWeb3Sign(dto.account, startPolkassemblyShare, confirmPolkassemblyShare)
}

export const usePolkassemblyShare = () => {
    return useMutation(handlePolkassemblyShare)
}
