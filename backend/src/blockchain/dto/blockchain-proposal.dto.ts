import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { DeriveAccountRegistration, DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { User } from '../../users/user.entity'
import { transformBalance } from '../utils'
import { BlockchainAccountInfo, toBlockchainAccountInfo } from './blockchain-account-info.dto'
import type { BlockNumber } from '@polkadot/types/interfaces/runtime'
import { BlockchainProposalMotion, toBlockchainProposalMotion } from './blockchain-proposal-motion.dto'
import { BlockchainProposalMotionEnd } from './blockchain-proposal-motion-end.dto'
import { encodeAddress } from '@polkadot/keyring'

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

    static create(
        derivedProposal: DeriveTreasuryProposal,
        status: BlockchainProposalStatus,
        identities: Map<string, DeriveAccountRegistration>,
        toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => BlockchainProposalMotionEnd,
    ): BlockchainProposal {
        const { id, council, proposal } = derivedProposal
        const proposerAddress = proposal.proposer.toHuman()
        const beneficiaryAddress = proposal.beneficiary.toHuman()

        const proposalIndex = id.toNumber()
        const proposer = toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress))
        const beneficiary = toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress))
        /*
            TODO We should get the decimals from the chain info or config files. This should be handled when adding multiple networks support.
             */
        const value = transformBalance(proposal.value, 12)
        const bond = transformBalance(proposal.bond, 12)
        const motions = council.map((motion) =>
            toBlockchainProposalMotion(motion, identities, toBlockchainProposalMotionEnd),
        )
        return new this(proposalIndex, proposer, beneficiary, value, bond, motions, status)
    }

    constructor(
        proposalIndex: number,
        proposer: BlockchainAccountInfo,
        beneficiary: BlockchainAccountInfo,
        value: number,
        bond: number,
        motions: BlockchainProposalMotion[],
        status: BlockchainProposalStatus,
    ) {
        this.proposalIndex = proposalIndex
        this.proposer = proposer
        this.beneficiary = beneficiary
        this.value = value
        this.bond = bond
        this.motions = motions
        this.status = status
    }

    isOwner = (user: User) => {
        const encodedProposerAddress = encodeAddress(this.proposer.address)
        return !!user.web3Addresses?.find(({ address }) => encodedProposerAddress === address)
    }

    isOwnerOrThrow = (user: User) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot add details to this proposal')
        }
    }

    isEditable = () => {
        return this.status === BlockchainProposalStatus.Proposal
    }

    isEditableOrThrow = () => {
        if (!this.isEditable()) {
            throw new BadRequestException('You cannot edit an approved/rewarded/rejected proposal details')
        }
    }
}
