import { INestApplication } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import {
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { ProposedMotionDto } from '../blockchain/dto/proposed-motion.dto'
import { BlockchainProposal, BlockchainProposalStatus } from '../blockchain/dto/blockchain-proposal.dto'
import { BlockchainTimeLeft } from '../blockchain/dto/blockchain-time-left.dto'
import { MotionTimeType } from '../blockchain/dto/motion-time.dto'
import { MotionMethod, MotionStatus, ProposalMotionMethod } from '../blockchain/dto/motion.dto'
import { UpdateExtrinsicDto } from '../extrinsics/dto/updateExtrinsic.dto'
import { CreateIdeaDto } from '../ideas/dto/create-idea.dto'
import { IdeaNetworkEntity } from '../ideas/entities/idea-network.entity'
import { CreateIdeaMilestoneDto } from '../ideas/idea-milestones/dto/create-idea-milestone.dto'
import { IdeaMilestoneNetworkStatus } from '../ideas/idea-milestones/entities/idea-milestone-network-status'
import { IdeaMilestoneNetworkEntity } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { createIdea, createIdeaMilestone, createWeb3SessionData } from '../ideas/spec.helpers'
import { getLogger } from '../logging.module'
import { NETWORKS } from '../utils/spec.helpers'
import { NetworkPlanckValue, Nil } from '../utils/types'
import { IdeaWithMilestones, ProposalsService } from './proposals.service'
import { BlockchainService } from '../blockchain/blockchain.service'
import { PublicUserDto } from '../users/dto/public-user.dto'

const makeMotion = (
    hash: string,
    method: MotionMethod,
    motionIndex: number,
    ayes: PublicUserDto[],
    nays: PublicUserDto[],
): ProposedMotionDto => ({
    status: MotionStatus.Proposed,
    hash,
    method,
    motionIndex,
    ayes,
    nays,
    threshold: 2,
    motionEnd: { type: MotionTimeType.Future, blockNo: 1, blocksCount: 1, time: { seconds: 6 } as BlockchainTimeLeft },
})

export const proposals = [
    new BlockchainProposal(
        0,
        '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        '1' as NetworkPlanckValue,
        '100' as NetworkPlanckValue,
        [makeMotion('hash_0_0', ProposalMotionMethod.Approve, 0, [], [])] as ProposedMotionDto[],
        BlockchainProposalStatus.Proposal,
    ),

    new BlockchainProposal(
        1,
        '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
        '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
        '2000' as NetworkPlanckValue,
        '40' as NetworkPlanckValue,
        [makeMotion('hash_1_0', ProposalMotionMethod.Approve, 1, [], [])] as ProposedMotionDto[],
        BlockchainProposalStatus.Proposal,
    ),
    new BlockchainProposal(
        2,
        '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
        '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',

        '1000' as NetworkPlanckValue,
        '20' as NetworkPlanckValue,

        [makeMotion('hash_3_0', ProposalMotionMethod.Approve, 2, [], [])] as ProposedMotionDto[],
        BlockchainProposalStatus.Proposal,
    ),
    new BlockchainProposal(
        3,
        '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
        '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',

        '1000' as NetworkPlanckValue,
        '20' as NetworkPlanckValue,
        [makeMotion('hash_3_0', ProposalMotionMethod.Approve, 2, [], [])] as ProposedMotionDto[],
        BlockchainProposalStatus.Approval,
    ),
]

export const updateExtrinsicDto: UpdateExtrinsicDto = {
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
} as UpdateExtrinsicDto

export const mockedBlockchainService = {
    listenForExtrinsic: async (
        netowkrId: string,
        extrinsicHash: string,
        cb: (updateExtrinsicDto: UpdateExtrinsicDto) => Promise<void>,
    ) => {
        await cb(updateExtrinsicDto)
    },
    getProposal: async (networkId: string, blockchainIndex: number): Promise<Nil<BlockchainProposal>> => {
        getLogger().info('Mock implementation of getProposals')
        if (networkId !== NETWORKS.POLKADOT) {
            return
        }
        return proposals.find((blockchainProposal) => blockchainProposal.proposalIndex === blockchainIndex)
    },
    getProposals: async (networkId: string) => {
        getLogger().info('Mock implementation of getProposals')
        if (networkId !== NETWORKS.POLKADOT) {
            return []
        }
        return proposals
    },
}
export const mockListenForExtrinsic = (blockchainService: BlockchainService) => {
    jest.spyOn(blockchainService, 'listenForExtrinsic').mockImplementation(mockedBlockchainService.listenForExtrinsic)
}
export const mockGetProposalAndGetProposals = (blockchainService: BlockchainService) => {
    jest.spyOn(blockchainService, 'getProposals').mockImplementation(mockedBlockchainService.getProposals)
    jest.spyOn(blockchainService, 'getProposal').mockImplementation(mockedBlockchainService.getProposal)
}

export const createProposerSessionData = (proposal: BlockchainProposal) => createWeb3SessionData(proposal.proposer)

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
            beneficiary: '14MBCttARciF9RZGW447KuLvjVtvJn8UQF3KJKHDtjW1ENT6',
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
