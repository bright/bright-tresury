import {getLogger} from "../logging.module";

export const mockedBlockchainService = {
    getProposals: () => {
        getLogger().info('Mock implementation of getproposals')
        return [
            {
                proposalIndex: 0,
                proposer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                beneficiary: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                bond: 0.001,
                value: 1e-14,
                status: 'proposal',
            },
            {
                proposalIndex: 3,
                proposer: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
                beneficiary: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
                bond: 20,
                value: 1000,
                status: 'approval',
            }
        ]
    }
}
