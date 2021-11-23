import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { BlockchainAccountInfo } from '../blockchain/dto/blockchain-account-info.dto'
import { BlockchainProposalMotion } from '../blockchain/dto/blockchain-proposal-motion.dto'
import { BlockchainProposal, BlockchainProposalStatus } from '../blockchain/dto/blockchain-proposal.dto'
import { BlockchainTimeLeft } from '../blockchain/dto/blockchain-time-left.dto'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { CreateIdeaDto } from '../ideas/dto/create-idea.dto'
import { IdeaNetworkEntity } from '../ideas/entities/idea-network.entity'
import { CreateIdeaMilestoneDto } from '../ideas/idea-milestones/dto/create-idea-milestone.dto'
import { IdeaMilestoneNetworkStatus } from '../ideas/idea-milestones/entities/idea-milestone-network-status'
import { IdeaMilestoneNetworkEntity } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { createIdea, createIdeaMilestone, createWeb3SessionData } from '../ideas/spec.helpers'
import { getLogger } from '../logging.module'
import { NETWORKS } from '../utils/spec.helpers'
import { NetworkPlanckValue } from '../utils/types'
import { IdeaWithMilestones, ProposalsService } from './proposals.service'

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

export const proposals = [
    new BlockchainProposal(
        0,
        { display: 'John Doe', address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
        { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' },
        '1' as NetworkPlanckValue,
        '100' as NetworkPlanckValue,
        [makeMotion('hash_0_0', 'approveProposal', 0, [], [])] as BlockchainProposalMotion[],
        BlockchainProposalStatus.Proposal,
    ),

    new BlockchainProposal(
        1,
        { address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y' },
        { display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },
        '2000' as NetworkPlanckValue,
        '40' as NetworkPlanckValue,
        [makeMotion('hash_1_0', 'approveProposal', 1, [], [])] as BlockchainProposalMotion[],
        BlockchainProposalStatus.Proposal,
    ),
    new BlockchainProposal(
        2,
        { address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y' },
        { display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },

        '1000' as NetworkPlanckValue,
        '20' as NetworkPlanckValue,

        [makeMotion('hash_3_0', 'approveProposal', 2, [], [])] as BlockchainProposalMotion[],
        BlockchainProposalStatus.Proposal,
    ),
    new BlockchainProposal(
        3,
        { address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y' },
        { display: 'Maybe Alice', address: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw' },

        '1000' as NetworkPlanckValue,
        '20' as NetworkPlanckValue,
        [makeMotion('hash_3_0', 'approveProposal', 2, [], [])] as BlockchainProposalMotion[],
        BlockchainProposalStatus.Approval,
    ),
]

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
        return proposals
    },
}

export const createProposerSessionData = (proposal: BlockchainProposal) =>
    createWeb3SessionData(proposal.proposer.address)

export const setUpIdea = async (
    app: INestApplication,
    sessionHandlerParam?: SessionHandler,
    ideaDto?: Partial<CreateIdeaDto>,
) => {
    const ideaNetworkRepository = app.get<Repository<IdeaNetworkEntity>>(getRepositoryToken(IdeaNetworkEntity))

    const sessionHandler = sessionHandlerParam ?? (await createUserSessionHandlerWithVerifiedEmail(app))

    const idea = await createIdea(
        {
            details: {
                title: 'ideaTitle',
                ...ideaDto?.details,
            },
            beneficiary: uuid(),
            networks: [{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }],
            ...ideaDto,
        },
        sessionHandler.sessionData,
    )
    idea.milestones = []

    const ideaNetwork = (await ideaNetworkRepository.findOne(idea.networks[0].id, { relations: ['idea'] }))!

    return {
        sessionHandler,
        idea: idea as IdeaWithMilestones,
        ideaNetwork,
    }
}

export const setUpIdeaWithMilestone = async (
    app: INestApplication,
    sessionHandlerParam?: SessionHandler,
    ideaDto?: Partial<CreateIdeaDto>,
    milestoneDto?: Partial<CreateIdeaMilestoneDto>,
) => {
    const { sessionHandler, idea, ideaNetwork } = await setUpIdea(app, sessionHandlerParam, ideaDto)

    const ideaMilestone = await createIdeaMilestone(
        idea.id,
        {
            networks: [
                {
                    name: NETWORKS.POLKADOT,
                    value: '100' as NetworkPlanckValue,
                    status: IdeaMilestoneNetworkStatus.Active,
                },
            ],
            ...milestoneDto,
            details: { subject: 'milestoneSubject', ...milestoneDto?.details },
        },
        sessionHandler.sessionData,
    )
    idea.milestones = [ideaMilestone]

    return {
        sessionHandler,
        ideaWithMilestone: idea as IdeaWithMilestones,
        ideaWithMilestoneNetwork: ideaNetwork,
        ideaMilestone,
        ideaMilestoneNetwork: ideaMilestone.networks[0],
    }
}

export const setUpProposalFromIdea = async (
    app: INestApplication,
    sessionHandlerParam?: SessionHandler,
    ideaDto?: Partial<CreateIdeaDto>,
) => {
    const ideaNetworkRepository = app.get<Repository<IdeaNetworkEntity>>(getRepositoryToken(IdeaNetworkEntity))
    const proposalsService = app.get(ProposalsService)

    const { sessionHandler, idea, ideaNetwork } = await setUpIdea(app, sessionHandlerParam, ideaDto)

    ideaNetwork.blockchainProposalId = 0
    await ideaNetworkRepository.save(ideaNetwork)
    const proposal = await proposalsService.createFromIdea(idea as IdeaWithMilestones, 0, ideaNetwork)

    return {
        sessionHandler,
        idea,
        proposal,
    }
}

export const setUpProposalFromIdeaMilestone = async (
    app: INestApplication,
    sessionHandlerParam?: SessionHandler,
    ideaDto?: Partial<CreateIdeaDto>,
    milestoneDto?: Partial<CreateIdeaMilestoneDto>,
) => {
    const ideaMilestoneNetworkRepository = app.get<Repository<IdeaMilestoneNetworkEntity>>(
        getRepositoryToken(IdeaMilestoneNetworkEntity),
    )
    const proposalsService = app.get(ProposalsService)

    const { sessionHandler, ideaWithMilestone, ideaMilestone, ideaMilestoneNetwork } = await setUpIdeaWithMilestone(
        app,
        sessionHandlerParam,
        ideaDto,
        milestoneDto,
    )

    ideaMilestoneNetwork.blockchainProposalId = 1
    await ideaMilestoneNetworkRepository.save(ideaMilestoneNetwork)
    const proposal = await proposalsService.createFromMilestone(
        ideaWithMilestone,
        1,
        ideaMilestoneNetwork,
        ideaMilestone,
    )

    return {
        sessionHandler,
        ideaWithMilestone,
        proposal,
    }
}
