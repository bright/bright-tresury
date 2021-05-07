import {DeriveCollectiveProposal, DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {transformBalance} from "../utils";
import {Vec} from "@polkadot/types";
import {AccountId} from "@polkadot/types/interfaces/runtime";

export enum BlockchainProposalStatus {
    Proposal = 'proposal',
    Approval = 'approval',
}

interface BlockchainProposalVote {
    hash: string,
    method: string,
    ayes: string[],
    nays: string[],
    motionIndex: number,
    threshold: number,
    end: number // block number when voting is over
}

export interface BlockchainProposal {
    proposalIndex: number,
    proposer: string,
    beneficiary: string,
    value: number,
    bond: number,
    council: BlockchainProposalVote[]
    status: BlockchainProposalStatus
}

function toBlockchainProposalVote (council: DeriveCollectiveProposal): BlockchainProposalVote {
    const toStringVotesArray = (votesVector: Vec<AccountId>): string[] => votesVector.toArray().map((accountId) => accountId.toHuman())
    const {hash, proposal, votes} = council
    return {
        hash: hash.toHuman(),
        method: proposal.method,
        ayes: votes ? toStringVotesArray(votes.ayes) : [],
        nays: votes ? toStringVotesArray(votes.nays) : [],
        motionIndex: votes?.index.toNumber(),
        threshold: votes?.threshold.toNumber(),
        end: votes?.end.toNumber()
    } as BlockchainProposalVote
}

export function toBlockchainProposal (derivedProposal: DeriveTreasuryProposal, status: BlockchainProposalStatus): BlockchainProposal {
    const {id, council, proposal} = derivedProposal
    return {
        proposalIndex: id.toNumber(),
        proposer: proposal.proposer.toHuman(),
        beneficiary: proposal.beneficiary.toHuman(),
        value: transformBalance(proposal.value, 15),
        bond: transformBalance(proposal.bond, 15),
        council: council.map(toBlockchainProposalVote),
        status
    } as BlockchainProposal
}
