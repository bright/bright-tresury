import {ProposalFilter} from "./ProposalStatusFilters";
import {ProposalDto, ProposalStatus} from "../proposals.api";

/** TODO: adjust when there will be more statuses supported on backend
 * and authorization will be possible */
export function filterProposals(proposals: ProposalDto[], filter: ProposalFilter): ProposalDto[] {
    switch (filter) {
        case ProposalFilter.All:
            return proposals
        case ProposalFilter.Submitted:
            return proposals.filter(proposal => proposal.status === ProposalStatus.Submitted)
        case ProposalFilter.Approved:
            return proposals.filter(proposal => proposal.status === ProposalStatus.Approved)
        case ProposalFilter.Rejected:
            return proposals.filter(proposal => proposal.status === ProposalStatus.Closed)
        case ProposalFilter.Rewarded:
            return proposals
    }
}

