import {DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {transformBalance} from "../utils";

export enum BlockchainProposalStatus {
    Proposal = 'proposal',
    Approval = 'approval'
}

export interface BlockchainProposal {
    proposalIndex: number,
    proposer: string,
    beneficiary: string,
    value: number,
    bond: number,
    status: BlockchainProposalStatus
}

export const fromDerivedTreasuryProposal = (derivedProposal: DeriveTreasuryProposal, status: BlockchainProposalStatus): BlockchainProposal => {
    const {id, proposal} = derivedProposal
    return {
        proposalIndex: id.toNumber(),
        proposer: proposal.proposer.toHuman(),
        beneficiary: proposal.beneficiary.toHuman(),
        value: transformBalance(proposal.value, 15),
        bond: transformBalance(proposal.bond, 15),
        status
    } as BlockchainProposal
}
