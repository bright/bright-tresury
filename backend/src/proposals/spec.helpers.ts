import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainProposal } from '../blockchain/dto/blockchain-proposal.dto'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { CreateIdeaDto } from '../ideas/dto/create-idea.dto'
import { IdeaNetwork } from '../ideas/entities/idea-network.entity'
import { CreateIdeaMilestoneDto } from '../ideas/idea-milestones/dto/create-idea-milestone.dto'
import { IdeaMilestoneNetwork } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { createIdea, createIdeaMilestone } from '../ideas/spec.helpers'
import { getLogger } from '../logging.module'
import { BlockchainAccountInfo } from '../blockchain/dto/blockchain-account-info.dto'
import { BlockchainProposalMotion } from '../blockchain/dto/blockchain-proposal-motion.dto'
import { BlockchainTimeLeft } from '../blockchain/dto/blockchain-time-left.dto'
import { NETWORKS } from '../utils/spec.helpers'
import { IdeaWithMilestones } from './proposals.service'

const makeMotion = (
    hash: string,
    method: string,
    motionIndex: number,
    ayes: BlockchainAccountInfo[],
    nays: BlockchainAccountInfo[],
): BlockchainProposalMotion => ({
    hash,
    method,
    motionIndex,
    ayes,
    nays,
    threshold: 2,
    motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } as BlockchainTimeLeft },
})

export const mockedBlockchainService = {
    listenForExtrinsic: async (
        netowkrId: string,
        extrinsicHash: string,
        cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
    ) => {
        await cb({
            blockHash: '0x6f5ff999f06b47f0c3084ab3a16113fde8840738c8b10e31d3c6567d4477ec04',
            events: [
                {
                    section: 'treasury',
                    method: 'Proposed',
                    data: [
                        {
                            name: 'ProposalIndex',
                            value: '3',
                        },
                    ],
                },
            ],
        } as UpdateExtrinsicDto)
    },
    getProposals: async (networkId: string) => {
        getLogger().info('Mock implementation of getProposals')
        if (networkId !== NETWORKS.POLKADOT) {
            return []
        }
        return [
            {
                proposalIndex: 0,
                proposer: { display: 'John Doe', address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                beneficiary: { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' },
                bond: 0.001,
                value: 1e-14,
                status: 'proposal',
                motions: [makeMotion('hash_0_0', 'approveProposal', 0, [], [])] as BlockchainProposalMotion[],
            },
            {
                proposalIndex: 1,
                proposer: { address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y' },
                beneficiary: { display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },
                bond: 40,
                value: 2000,
                status: 'proposal',
                motions: [makeMotion('hash_1_0', 'approveProposal', 1, [], [])] as BlockchainProposalMotion[],
            },
            {
                proposalIndex: 3,
                proposer: { address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y' },
                beneficiary: { display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },
                bond: 20,
                value: 1000,
                status: 'approval',
                motions: [makeMotion('hash_3_0', 'approveProposal', 2, [], [])] as BlockchainProposalMotion[],
            },
        ] as BlockchainProposal[]
    },
}

export const setUpValues = async (
    app: INestApplication,
    ideaDto?: Partial<CreateIdeaDto>,
    milestoneDto?: Partial<CreateIdeaMilestoneDto>,
) => {
    const ideaNetworkRepository = app.get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork))

    const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app)

    const idea = await createIdea(
        {
            details: { title: 'ideaTitle' },
            beneficiary: uuid(),
            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
            ...ideaDto,
        },
        sessionHandler.sessionData,
    )
    idea.milestones = []

    const ideaNetwork = (await ideaNetworkRepository.findOne(idea.networks[0].id, { relations: ['idea'] }))!

    const ideaWithMilestones = await createIdea(
        {
            details: { title: 'ideaWithMilestoneTitle' },
            beneficiary: uuid(),
            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
        },
        sessionHandler.sessionData,
    )

    const ideaMilestone = await createIdeaMilestone(
        ideaWithMilestones.id,
        {
            networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
            ...milestoneDto,
            details: { subject: 'milestoneSubject', ...milestoneDto?.details },
        },
        sessionHandler.sessionData,
    )
    ideaWithMilestones.milestones = [ideaMilestone]

    return {
        sessionHandler,
        idea: idea as IdeaWithMilestones,
        ideaNetwork,
        ideaWithMilestones: ideaWithMilestones as IdeaWithMilestones,
        ideaWithMilestoneNetwork: ideaWithMilestones.networks[0],
        ideaMilestone,
        ideaMilestoneNetwork: ideaMilestone.networks[0],
    }
}
