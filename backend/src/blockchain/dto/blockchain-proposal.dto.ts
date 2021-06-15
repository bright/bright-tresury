import { DeriveAccountRegistration, DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { transformBalance } from '../utils'
import { BlockchainAccountInfo, toBlockchainAccountInfo } from './blockchain-account-info.dto'
import type { BlockNumber } from '@polkadot/types/interfaces/runtime'
import { BlockchainProposalMotion, toBlockchainProposalMotion } from './blockchain-proposal-motion.dto'
import { BlockchainProposalMotionEnd } from './blockchain-proposal-motion-end.dto'

export enum BlockchainProposalStatus {
    Proposal = 'proposal',
    Approval = 'approval',
}

export class BlockchainProposal {
    proposalIndex: number
    proposer: BlockchainAccountInfo
    beneficiary: BlockchainAccountInfo
    value: number
    bond: number
    motions: BlockchainProposalMotion[]
    status: BlockchainProposalStatus

    constructor({ proposalIndex, proposer, beneficiary, value, bond, motions, status }: BlockchainProposal) {
        this.proposalIndex = proposalIndex
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond
        this.motions = motions
        this.status = status
    }
}

export function toBlockchainProposal(
    derivedProposal: DeriveTreasuryProposal,
    status: BlockchainProposalStatus,
    identities: Map<string, DeriveAccountRegistration>,
    toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => BlockchainProposalMotionEnd,
): BlockchainProposal {
    const { id, council, proposal } = derivedProposal
    const proposerAddress = proposal.proposer.toHuman()
    const beneficiaryAddress = proposal.beneficiary.toHuman()
    return new BlockchainProposal({
        proposalIndex: id.toNumber(),
        proposer: toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress)),
        beneficiary: toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress)),
        /*
        TODO We should get the decimals from the chain info or config files. This should be handled when adding multiple networks support.
         */
        value: transformBalance(proposal.value, 12),
        bond: transformBalance(proposal.bond, 12),
        motions: council.map((motion) => toBlockchainProposalMotion(motion, identities, toBlockchainProposalMotionEnd)),
        status,
    })
}
