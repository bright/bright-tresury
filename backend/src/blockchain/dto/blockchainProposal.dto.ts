import {DeriveAccountRegistration, DeriveCollectiveProposal, DeriveTreasuryProposal} from "@polkadot/api-derive/types";
import {transformBalance} from "../utils";
import {Vec} from "@polkadot/types";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import {BlockchainAccountInfo, toBlockchainAccountInfo} from "./blockchainAccountInfo.dto";
import type { BlockNumber } from '@polkadot/types/interfaces/runtime';
import {Time} from "@polkadot/util/types";

export enum BlockchainProposalStatus {
    Proposal = 'proposal',
    Approval = 'approval',
}

export interface BlockchainProposalMotion {
    hash: string;
    method: string;
    ayes: BlockchainAccountInfo[];
    nays: BlockchainAccountInfo[];
    motionIndex: number;
    threshold: number;
    end: BlockchainMotionEnd; // block number when voting is over
}

export interface BlockchainProposal {
    proposalIndex: number;
    proposer: BlockchainAccountInfo;
    beneficiary: BlockchainAccountInfo;
    value: number;
    bond: number;
    council: BlockchainProposalMotion[];
    status: BlockchainProposalStatus;
}

export interface BlockchainMotionEnd {
    endBlock?: number,
    remainingBlocks?: number,
    timeLeft?: Time
}
function toBlockchainProposalMotion (council: DeriveCollectiveProposal,
                                   identities: Map<string, DeriveAccountRegistration>,
                                   calcRemainingTime: (endBlock: BlockNumber | undefined) => BlockchainMotionEnd): BlockchainProposalMotion {
    const toStringVotesArray = (votesVector: Vec<AccountId> | undefined): string[] => votesVector?.toArray()?.map((accountId) => accountId.toHuman()) || []
    const {hash, proposal, votes} = council
    return {
        hash: hash.toHuman(),
        method: proposal.method,
        ayes: toStringVotesArray(votes?.ayes).map( (address) => toBlockchainAccountInfo(address, identities.get(address))),
        nays: toStringVotesArray(votes?.nays).map( (address) => toBlockchainAccountInfo(address, identities.get(address))),
        motionIndex: votes?.index.toNumber(),
        threshold: votes?.threshold.toNumber(),
        end: calcRemainingTime(votes?.end)
    } as BlockchainProposalMotion
}

export function toBlockchainProposal (derivedProposal: DeriveTreasuryProposal,
                                      status: BlockchainProposalStatus,
                                      identities: Map<string, DeriveAccountRegistration>,
                                      calcRemainingTime: (endBlock: BlockNumber | undefined) => BlockchainMotionEnd): BlockchainProposal {
    const {id, council, proposal} = derivedProposal
    const proposerAddress = proposal.proposer.toHuman()
    const beneficiaryAddress = proposal.beneficiary.toHuman()
    return {
        proposalIndex: id.toNumber(),
        proposer: toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress)),
        beneficiary: toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress)),
        value: transformBalance(proposal.value, 15),
        bond: transformBalance(proposal.bond, 15),
        council: council.map((motion) => toBlockchainProposalMotion(motion, identities, calcRemainingTime)),
        status
    } as BlockchainProposal
}
