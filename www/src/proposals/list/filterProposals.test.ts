import {ProposalDto, ProposalStatus} from "../proposals.api";
import {filterProposals} from "./filterProposals";
import {ProposalFilter} from "./ProposalStatusFilters";

describe('filter proposals', () => {
    test('filter proposals by all', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Closed)
        ]

        expect(filterProposals(proposals, ProposalFilter.All)).toStrictEqual([
            proposals[0],
            proposals[1],
            proposals[2]
        ]);
    })
    test('filter proposals by approved', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Closed),
            createProposal(ProposalStatus.Approved),
        ]

        expect(filterProposals(proposals, ProposalFilter.Approved)).toStrictEqual([
            proposals[0],
            proposals[3],
        ]);
    })
    test('filter proposals by submitted', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Closed),
            createProposal(ProposalStatus.Submitted),
        ]

        expect(filterProposals(proposals, ProposalFilter.Submitted)).toStrictEqual([
            proposals[1],
            proposals[3],
        ]);
    })
    test('filter proposals by rejected', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Submitted),
            createProposal(ProposalStatus.Rejected),
            createProposal(ProposalStatus.Rejected),
        ]

        expect(filterProposals(proposals, ProposalFilter.Rejected)).toStrictEqual([
            proposals[2],
            proposals[3],
        ]);
    })
    test('filter proposals by rewarded', () => {
        const proposals = [
            createProposal(ProposalStatus.Approved),
            createProposal(ProposalStatus.Rewarded),
            createProposal(ProposalStatus.Rewarded),
            createProposal(ProposalStatus.Rejected),
        ]

        expect(filterProposals(proposals, ProposalFilter.Rewarded)).toStrictEqual([
            proposals[1],
            proposals[2],
        ]);
    })
})

function createProposal(status: ProposalStatus): ProposalDto {
    return {
        status: status
    } as ProposalDto
}
