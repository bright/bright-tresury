import { useMutation } from 'react-query'
import { apiPatch } from '../../../api'
import { PROPOSALS_API_PATH } from '../../proposals.api'
import { EditProposalDetailsDto, ProposalDetailsDto } from './proposal-details.dto'

// PATCH

interface PatchProposalDetailsParams {
    proposalIndex: number
    network: string
    dto: EditProposalDetailsDto
}

function patchProposalDetails({
    proposalIndex,
    network,
    dto,
}: PatchProposalDetailsParams): Promise<ProposalDetailsDto> {
    return apiPatch<ProposalDetailsDto>(`${PROPOSALS_API_PATH}/${proposalIndex}/details?network=${network}`, dto)
}

export const usePatchProposalDetails = () => {
    return useMutation(patchProposalDetails)
}
