import {DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {transformBalance} from "../utils";
import { IdeaMilestone } from '../../ideas/ideaMilestones/entities/idea.milestone.entity'
import { Idea } from '../../ideas/entities/idea.entity'

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

export type ExtendedBlockchainProposal = BlockchainProposal & {
    idea?: Idea,
    ideaMilestone?: IdeaMilestone
}

export function toBlockchainProposal (derivedProposal: DeriveTreasuryProposal, status: BlockchainProposalStatus): BlockchainProposal {
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
