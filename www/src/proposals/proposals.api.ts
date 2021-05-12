import { apiGet } from '../api'

export enum ProposalStatus {
    Submitted = 'submitted',
    Approved = 'approved',
    Rejected = 'rejected',
    Rewarded = 'rewarded',
    Closed = 'closed',
}

export interface ProposalDto {
    proposalIndex: number
    proposer: string
    beneficiary: string
    value: number
    bond: number
    status: ProposalStatus
    title?: string
    ideaId?: string
    ideaMilestoneId?: string
}

export function getProposals(networkName: string) {
    return apiGet<ProposalDto[]>(`/proposals/?network=${networkName}`)
}

export function getProposal(index: string, networkName: string) {
    return apiGet<ProposalDto>(`/proposals/${index}?network=${networkName}`)
}
