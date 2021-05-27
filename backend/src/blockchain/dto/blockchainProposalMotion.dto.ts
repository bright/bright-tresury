import {BlockchainAccountInfo, toBlockchainAccountInfo} from "./blockchainAccountInfo.dto";
import {DeriveAccountRegistration, DeriveCollectiveProposal} from "@polkadot/api-derive/types";
import {AccountId, BlockNumber} from "@polkadot/types/interfaces/runtime";
import {Nil} from "../../utils/types";
import {Vec} from "@polkadot/types";
import {BlockchainProposalMotionEnd} from "./blockchainProposalMotionEnd.dto";

export interface BlockchainProposalMotion {
    hash: string;
    method: string;
    ayes: Nil<BlockchainAccountInfo[]>;
    nays: Nil<BlockchainAccountInfo[]>;
    motionIndex: Nil<number>;
    threshold: Nil<number>;
    end: Nil<BlockchainProposalMotionEnd>;
}

export function toBlockchainProposalMotion (council: DeriveCollectiveProposal,
                                     identities: Map<string, DeriveAccountRegistration>,
                                     toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => BlockchainProposalMotionEnd): BlockchainProposalMotion {
    const toStringVotesArray = (votesVector: Vec<AccountId>): string[] => votesVector.toArray().map((accountId) => accountId.toHuman())
    const {hash, proposal, votes} = council
    if (votes === null) {
        return {
            hash: hash.toString(),
            method: proposal.method
        } as BlockchainProposalMotion;
    }
    return {
        hash: hash.toHuman(),
        method: proposal.method,
        ayes: toStringVotesArray(votes.ayes).map( (address) => toBlockchainAccountInfo(address, identities.get(address))),
        nays: toStringVotesArray(votes.nays).map( (address) => toBlockchainAccountInfo(address, identities.get(address))),
        motionIndex: votes.index.toNumber(),
        threshold: votes.threshold.toNumber(),
        end: toBlockchainProposalMotionEnd(votes.end)
    } as BlockchainProposalMotion
}
