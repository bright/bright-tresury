import { useMutation } from 'react-query'
import { apiDelete, apiPost } from '../../../api'
import {
    ConfirmWeb3SignRequestDto,
    handleWeb3Sign,
    StartWeb3SignRequestDto,
    StartWeb3SignResponseDto,
} from '../../handleWeb3Sign'
import { Web3AssociateValues } from './Web3AccountForm'
import { StartWeb3AssociateRequestDto } from './web3Associate.dto'

function startWeb3Association(dto: StartWeb3AssociateRequestDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/web3/associate/start`, dto)
}

function confirmWeb3Association(dto: ConfirmWeb3SignRequestDto): Promise<void> {
    return apiPost<void>('/auth/web3/associate/confirm', dto)
}

function handleAssociateWeb3Account(values: Web3AssociateValues) {
    const startCall = (dto: StartWeb3SignRequestDto): Promise<StartWeb3SignResponseDto> => {
        return startWeb3Association({ address: dto.address, password: values.password })
    }
    return handleWeb3Sign(values.account, startCall, confirmWeb3Association)
}

export const useAssociateWeb3Account = () => {
    return useMutation(handleAssociateWeb3Account)
}

function unlinkAddress(address: string): Promise<void> {
    return apiDelete(`/auth/web3/addresses/${address}`)
}

export const useUnlinkAddress = () => {
    return useMutation(unlinkAddress)
}

function makePrimary(address: string): Promise<void> {
    return apiPost(`/auth/web3/addresses/${address}/make-primary`)
}

export const useMakePrimary = () => {
    return useMutation(makePrimary)
}
