import {apiDelete, apiPost} from '../../../api'
import {ConfirmWeb3SignRequestDto, StartWeb3SignResponseDto} from '../../handleWeb3Sign'

export interface StartWeb3AssociateRequestDto {
    address: string
    password?: string
}

export function startWeb3Association(dto: StartWeb3AssociateRequestDto): Promise<StartWeb3SignResponseDto> {
    return apiPost<StartWeb3SignResponseDto>(`/auth/web3/associate/start`, dto)
}

export function confirmWeb3Association(dto: ConfirmWeb3SignRequestDto): Promise<void> {
    return apiPost<void>('/auth/web3/associate/confirm', dto)
}

export function unlinkAddress(address: string) {
    return apiDelete(`/auth/web3/addresses/${address}`)
}

export function makePrimary(address: string) {
    return apiPost(`/auth/web3/addresses/${address}/make-primary`)
}
