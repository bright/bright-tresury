import {BlockchainProposal} from "../blockchain/dto/blockchainProposal.dto";
import {Time} from "@polkadot/util/types";
import {getLogger} from "../logging.module";
import {BlockchainAccountInfo} from "../blockchain/dto/blockchainAccountInfo.dto";
import {BlockchainProposalMotion} from "../blockchain/dto/blockchainProposalMotion.dto";

const makeMotion = (hash: string, method: string, motionIndex: number,
                    ayes: BlockchainAccountInfo[], nays: BlockchainAccountInfo[]): BlockchainProposalMotion =>
    ({hash, method, motionIndex, ayes, nays, threshold: 2, end: {endBlock:1, remainingBlocks: 1, timeLeft: {seconds: 6} as Time}});

export const mockedBlockchainService = {
    getProposals: async () => {
        getLogger().info('Mock implementation of getProposals')
        return [
            {
                proposalIndex: 0,
                proposer: {display: 'John Doe', address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                beneficiary: { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' },
                bond: 0.001,
                value: 1e-14,
                status: 'proposal',
                motions: [
                    makeMotion('hash_0_0', 'approveProposal', 0, [], [])
                ] as BlockchainProposalMotion[]
            },
            {
                proposalIndex: 1,
                proposer: {address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'},
                beneficiary: {display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw'},
                bond: 40,
                value: 2000,
                status: 'proposal',
                motions: [
                    makeMotion('hash_1_0', 'approveProposal', 1, [], [])
                ] as BlockchainProposalMotion[]
            },
            {
                proposalIndex: 3,
                proposer: {address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'},
                beneficiary: {display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },
                bond: 20,
                value: 1000,
                status: 'approval',
                motions: [
                    makeMotion('hash_3_0', 'approveProposal', 2, [], [])
                ] as BlockchainProposalMotion[]
            }
        ] as BlockchainProposal[]
    },
}
