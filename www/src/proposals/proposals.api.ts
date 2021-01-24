import {API_URL, fetchAndUnwrap} from '../api'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
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
    return fetchAndUnwrap<ProposalDto[]>('GET', `${ProposalApiPath}/?network=${networkName}`)
}