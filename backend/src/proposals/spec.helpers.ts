import {BlockchainProposal, BlockchainProposalVote} from "../blockchain/dto/blockchainProposal.dto";
import {getLogger} from "../logging.module";

export const mockedBlockchainService = {
    getProposals: async () => {
        getLogger().info('Mock implementation of getProposals')
        return [
            {
                proposalIndex: 0,
                proposer: {address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                beneficiary: { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' },
                bond: 0.001,
                value: 1e-14,
                status: 'proposal',
                council: [] as BlockchainProposalVote[]
            },
            {
                proposalIndex: 1,
                proposer: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
                beneficiary: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
                bond: 40,
                value: 2000,
                status: 'proposal',
                council: [] as BlockchainProposalVote[]
            },
            {
                proposalIndex: 3,
                proposer: {address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'},
                beneficiary: {address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },
                bond: 20,
                value: 1000,
                status: 'approval',
                council: [] as BlockchainProposalVote[]
            }
        ] as BlockchainProposal[]
    },
}
