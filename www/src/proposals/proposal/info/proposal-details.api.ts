import { useMutation } from 'react-query'
import { apiPatch, apiPost } from '../../../api'
import { PROPOSALS_API_PATH } from '../../proposals.api'
import { CreateProposalDetailsDto, ProposalDetailsDto } from './proposal-details.dto'

export interface MutateProposalDetailsParams {
    proposalIndex: number
    network: string
    dto: CreateProposalDetailsDto
}

// POST

function postProposalDetails({
    proposalIndex,
    network,
    dto,
}: MutateProposalDetailsParams): Promise<ProposalDetailsDto> {
    return apiPost<ProposalDetailsDto>(`${PROPOSALS_API_PATH}/${proposalIndex}/details?network=${network}`, dto)
}

export const usePostProposalDetails = () => {
    return useMutation(postProposalDetails)
}

// PATCH

function patchProposalDetails({
    proposalIndex,
    network,
    dto,
}: MutateProposalDetailsParams): Promise<ProposalDetailsDto> {
    return apiPatch<ProposalDetailsDto>(`${PROPOSALS_API_PATH}/${proposalIndex}/details?network=${network}`, dto)
}

export const usePatchProposalDetails = () => {
    return useMutation(patchProposalDetails)
}
