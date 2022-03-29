import { ForbiddenException } from '@nestjs/common'
import { DeriveAccountRegistration, DeriveTreasuryProposal } from '@polkadot/api-derive/types'
import { UserEntity } from '../../users/entities/user.entity'
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
    proposer: string
    beneficiary: string
    value: NetworkPlanckValue
    bond: NetworkPlanckValue
    motions: ProposedMotionDto[]
    status: BlockchainProposalStatus

    static create(
        derivedProposal: DeriveTreasuryProposal,
        status: BlockchainProposalStatus,
        toBlockchainProposalMotionEnd: (endBlock: BlockNumber) => MotionTimeDto,
    ): BlockchainProposal {
        const { id, council, proposal } = derivedProposal
        const proposerAddress = proposal.proposer.toHuman()
        const beneficiaryAddress = proposal.beneficiary.toHuman()

        const proposalIndex = id.toNumber()
        const proposer = proposerAddress
        const beneficiary = beneficiaryAddress
        const value = proposal.value.toString() as NetworkPlanckValue
        const bond = proposal.bond.toString() as NetworkPlanckValue
        const motions = council.map((motion) => toBlockchainMotion(motion, toBlockchainProposalMotionEnd))
        return new this(proposalIndex, proposer, beneficiary, value, bond, motions, status)
    }

    constructor(
        proposalIndex: number,
        proposer: string,
        beneficiary: string,
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
        const encodedProposerAddress = encodeAddress(this.proposer)
        return !!user.web3Addresses?.find(({ address }) => encodedProposerAddress === address)
    }

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot add details to this proposal')
        }
    }
}
