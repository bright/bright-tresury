import {DeriveAccountRegistration, DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {transformBalance} from "../utils";
import {BlockchainAccountInfo, toBlockchainAccountInfo} from "./blockchainAccountInfo.dto";
import type { BlockNumber } from '@polkadot/types/interfaces/runtime';
import {
    BlockchainProposalMotion,
    toBlockchainProposalMotion
} from "./blockchainProposalMotion.dto";
import {BlockchainProposalMotionEnd} from "./blockchainProposalMotionEnd.dto";

export enum BlockchainProposalStatus {
    Proposal = 'proposal',
    Approval = 'approval',
}

export interface BlockchainProposal {
    proposalIndex: number;
    proposer: BlockchainAccountInfo;
    beneficiary: BlockchainAccountInfo;
    value: number;
    bond: number;
    motions: BlockchainProposalMotion[];
    status: BlockchainProposalStatus;
}

export function toBlockchainProposal (derivedProposal: DeriveTreasuryProposal,
                                      status: BlockchainProposalStatus,
                                      identities: Map<string, DeriveAccountRegistration>,
                                      toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => BlockchainProposalMotionEnd): BlockchainProposal {
    const {id, council, proposal} = derivedProposal
    const proposerAddress = proposal.proposer.toHuman()
    const beneficiaryAddress = proposal.beneficiary.toHuman()
    return {
        proposalIndex: id.toNumber(),
        proposer: toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress)),
        beneficiary: toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress)),
        value: transformBalance(proposal.value, 15),
        bond: transformBalance(proposal.bond, 15),
        motions: council.map((motion) => toBlockchainProposalMotion(motion, identities, toBlockchainProposalMotionEnd)),
        status
    } as BlockchainProposal
}
