import BN from 'bn.js';

export interface BlockchainProposal {
    proposalIndex: number,
    proposer: string,
    beneficiary: string,
    value: BN,
    bond: BN,
}
