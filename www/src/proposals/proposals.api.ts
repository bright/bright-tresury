import api, {API_URL} from '../api';

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
    return api.get<ProposalDto[]>(`${ProposalApiPath}/?network=${networkName}`).then((response) => response.data)
}

export function getProposalByIndex(index: string, networkName: string) {
    return api.get<ProposalDto>(`${ProposalApiPath}/${index}?network=${networkName}`).then((response) => response.data)
}
