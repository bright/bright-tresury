import { AccountInfo } from '../../util/types'
import { ProposalFilter } from './ProposalStatusFilters'
import { ProposalDto, ProposalStatus } from '../proposals.dto'
import { AuthContextUser } from '../../auth/AuthContext'

/** TODO: adjust when there will be more statuses supported on backend
 * and authorization will be possible */
export function filterProposals(
    proposals: ProposalDto[],
    filter: ProposalFilter,
    user?: AuthContextUser,
): ProposalDto[] {
    switch (filter) {
        case ProposalFilter.All:
            return proposals
        case ProposalFilter.Mine:
            return proposals.filter((proposal) => isProposalMadeByUser(proposal, user))
        case ProposalFilter.Submitted:
            return proposals.filter((proposal) => proposal.status === ProposalStatus.Submitted)
        case ProposalFilter.Approved:
            return proposals.filter((proposal) => proposal.status === ProposalStatus.Approved)
        case ProposalFilter.Rejected:
            return proposals.filter((proposal) => proposal.status === ProposalStatus.Rejected)
        case ProposalFilter.Rewarded:
            return proposals.filter((proposal) => proposal.status === ProposalStatus.Rewarded)
    }
}

const isProposalOwner = (ownerId?: string, user?: AuthContextUser) => ownerId && ownerId === user?.id
const isProposalProposer = (proposer: AccountInfo, user?: AuthContextUser) =>
    !!user?.web3Addresses.find((web3Address) => web3Address.address === proposer.address)

export const isProposalMadeByUser = (proposal: ProposalDto, user?: AuthContextUser): boolean =>
    isProposalOwner(proposal.ownerId, user) || isProposalProposer(proposal.proposer, user)
