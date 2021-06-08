import { useMutation } from 'react-query'
import { apiPost } from '../../../api'
import config from '../../../config'
import {
    ConfirmWeb3SignRequestDto,
    handleWeb3Sign,
    StartWeb3SignRequestDto,
    StartWeb3SignResponseDto,
} from '../../handleWeb3Sign'
import { Web3SignUpValues } from './Web3SignUp'

function startWeb3SignUp(dto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/web3/signup/start`, dto)
}

function confirmWeb3SignUp(dto: ConfirmWeb3SignRequestDto): Promise<void> {
    return apiPost<void>(`/auth/web3/signup/confirm`, dto)
}

function handleWeb3SignUp(dto: Web3SignUpValues) {
    return handleWeb3Sign(dto.account, startWeb3SignUp, async (confirmDto: ConfirmWeb3SignRequestDto) => {
        await confirmWeb3SignUp({
            ...confirmDto,
            details: {
                network: config.NETWORK_NAME,
            },
        })
    })
}

export const useWeb3SignUp = () => {
    return useMutation(handleWeb3SignUp)
}
