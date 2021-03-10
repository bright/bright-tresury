import {API_URL, apiGet} from '../api';

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed'
}

export interface ProposalDto {
    proposalIndex: number
    proposer: string
    beneficiary: string
    value: number
    bond: number
    status: ProposalStatus
    ideaId?: string
    ideaNumber?: number
    title?: string
}

const ProposalApiPath = `${API_URL}/proposals`

export function getProposalsByNetwork(networkName: string) {
    return apiGet<ProposalDto[]>(`${ProposalApiPath}/?network=${networkName}`)
}

export function getProposalByIndex(index: string, networkName: string) {
    return apiGet<ProposalDto>(`${ProposalApiPath}/${index}?network=${networkName}`)
}
