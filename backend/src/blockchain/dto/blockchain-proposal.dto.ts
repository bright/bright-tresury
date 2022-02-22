import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { DeriveAccountRegistration, DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { UserEntity } from '../../users/user.entity'
import { BlockchainAccountInfo, toBlockchainAccountInfo } from './blockchain-account-info.dto'
import type { BlockNumber } from '@polkadot/types/interfaces/runtime'
import { ProposedMotionDto, toBlockchainMotion } from './proposed-motion.dto'
import { MotionTimeDto } from './motion-time.dto'
import { encodeAddress } from '@polkadot/keyring'
import { NetworkPlanckValue } from '../../utils/types'

export enum BlockchainProposalStatus {
    Proposal = 'proposal',
    Approval = 'approval',
    Unknown = 'unknown',
}

export class BlockchainProposal {
    proposalIndex: number
    proposer: BlockchainAccountInfo
    beneficiary: BlockchainAccountInfo
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    motions: ProposedMotionDto[]
    status: BlockchainProposalStatus

    static create(
        derivedProposal: DeriveTreasuryProposal,
        status: BlockchainProposalStatus,
        identities: Map<string, DeriveAccountRegistration>,
        toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => MotionTimeDto,
    ): BlockchainProposal {
        const { id, council, proposal } = derivedProposal
        const proposerAddress = proposal.proposer.toHuman()
        const beneficiaryAddress = proposal.beneficiary.toHuman()

        const proposalIndex = id.toNumber()
        const proposer = toBlockchainAccountInfo(proposerAddress, identities.get(proposerAddress))
        const beneficiary = toBlockchainAccountInfo(beneficiaryAddress, identities.get(beneficiaryAddress))
        const value = proposal.value.toString() as NetworkPlanckValue
        const bond = proposal.bond.toString() as NetworkPlanckValue
        const motions = council.map((motion) => toBlockchainMotion(motion, identities, toBlockchainProposalMotionEnd))
        return new this(proposalIndex, proposer, beneficiary, value, bond, motions, status)
    }

    constructor(
        proposalIndex: number,
        proposer: BlockchainAccountInfo,
        beneficiary: BlockchainAccountInfo,
        value: NetworkPlanckValue,
        bond: NetworkPlanckValue,
        motions: ProposedMotionDto[],
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

    isOwner = (user: UserEntity) => {
        const encodedProposerAddress = encodeAddress(this.proposer.address)
        return !!user.web3Addresses?.find(({ address }) => encodedProposerAddress === address)
    }

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot add details to this proposal')
        }
    }

    isEditable = () => {
        return this.status === BlockchainProposalStatus.Proposal
    }

    isEditableOrThrow = () => {
        // TODO uncomment in TREAS-405
        // if (!this.isEditable()) {
        //     throw new BadRequestException('You cannot edit an approved/rewarded/rejected proposal details')
        // }
    }
}
