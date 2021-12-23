import { NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../blockchain/blockchain.service'
import { IdeaProposalDetailsEntity } from '../idea-proposal-details/idea-proposal-details.entity'
import { createIdeaMilestone } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { ProposalEntity } from './entities/proposal.entity'
import { ProposalMilestoneEntity } from './proposal-milestones/entities/proposal-milestone.entity'
import { ProposalsService } from './proposals.service'
import {
    mockGetProposalAndGetProposals, mockListenForExtrinsic,
    setUpIdea,
    setUpIdeaWithMilestone,
} from './spec.helpers'
import { IdeaMilestoneNetworkStatus } from '../ideas/idea-milestones/entities/idea-milestone-network-status'
import { NetworkPlanckValue } from '../utils/types'
import { PaginatedParams } from '../utils/pagination/paginated.param'
import { TimeFrame } from '../utils/time-frame.query'

describe('ProposalsService', () => {
    const app = beforeSetupFullApp()

    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))
    const proposalsRepository = beforeAllSetup(() =>
        app().get<Repository<ProposalEntity>>(getRepositoryToken(ProposalEntity)),
    )
    const detailsRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaProposalDetailsEntity>>(getRepositoryToken(IdeaProposalDetailsEntity)),
    )

    beforeAll(() => {
        mockGetProposalAndGetProposals(app().get(BlockchainService))
        mockListenForExtrinsic(app().get(BlockchainService))
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('find', () => {
        it('should return proposals', async () => {
            const { idea, ideaNetwork, sessionHandler } = await setUpIdea(app())
            const { ideaWithMilestone, ideaMilestone, ideaMilestoneNetwork } = await setUpIdeaWithMilestone(
                app(),
                sessionHandler,
            )
            await proposalsService().createFromIdea(idea, 0, ideaNetwork)
            await proposalsService().createFromMilestone(ideaWithMilestone, 1, ideaMilestoneNetwork, ideaMilestone)

            const paginated = await proposalsService().find(NETWORKS.POLKADOT, TimeFrame.OnChain, new PaginatedParams({}))
            const proposals = paginated.items
            expect(proposals).toHaveLength(4)

            const proposal1 = proposals.find(({ blockchain: { proposalIndex } }) => proposalIndex === 0)

            expect(proposal1).toBeDefined()
            expect(proposal1!.blockchain.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal1!.blockchain.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal1!.blockchain.bond).toBe('100')
            expect(proposal1!.blockchain.value).toBe('1')
            expect(proposal1!.blockchain.status).toBe('proposal')
            expect(proposal1!.blockchain.motions).toBeDefined()
            expect(proposal1!.entity!.details.title).toBe('ideaTitle')
            expect(proposal1!.isCreatedFromIdea).toBe(true)
            expect(proposal1!.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal1!.ideaId).toBe(idea.id)
            expect(proposal1!.ideaMilestoneId).toBeUndefined()

            const proposal2 = proposals.find(({ blockchain: { proposalIndex } }) => proposalIndex === 1)
            expect(proposal2).toBeDefined()
            expect(proposal2!.blockchain.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal2!.blockchain.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal2!.blockchain.bond).toBe('40')
            expect(proposal2!.blockchain.value).toBe('2000')
            expect(proposal2!.blockchain.status).toBe('proposal')
            expect(proposal2!.blockchain.motions).toBeDefined()
            expect(proposal2!.entity!.details.title).toBe('ideaTitle - milestoneSubject')
            expect(proposal2!.isCreatedFromIdea).toBe(false)
            expect(proposal2!.isCreatedFromIdeaMilestone).toBe(true)
            expect(proposal2!.ideaId).toBe(ideaWithMilestone.id)
            expect(proposal2!.ideaMilestoneId).toBe(ideaMilestone.id)

            const proposal3 = proposals.find(({ blockchain: { proposalIndex } }) => proposalIndex === 3)
            expect(proposal3!.blockchain.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal3!.blockchain.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal3!.blockchain.bond).toBe('20')
            expect(proposal3!.blockchain.value).toBe('1000')
            expect(proposal3!.blockchain.status).toBe('approval')
            expect(proposal3!.blockchain.motions).toBeDefined()
            expect(proposal3!.entity).toBeUndefined()
            expect(proposal3!.isCreatedFromIdea).toBe(false)
            expect(proposal3!.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal3!.ideaId).toBeUndefined()
            expect(proposal3!.ideaMilestoneId).toBeUndefined()
        })
    })

    describe('findOne', () => {
        it('should return blockchain proposal details', async () => {
            const proposal = await proposalsService().findOne(0, NETWORKS.POLKADOT)

            expect(proposal.blockchain).toBeDefined()
            expect(proposal.blockchain.proposalIndex).toBe(0)
            expect(proposal.blockchain.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal.blockchain.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal.blockchain.bond).toBe('100')
            expect(proposal.blockchain.value).toBe('1')
            expect(proposal.blockchain.status).toBe('proposal')
        })

        it('should return proposal entity details', async () => {
            const { idea } = await setUpIdea(app())
            const details = await detailsRepository().save(
                await detailsRepository().create({
                    title: 'title',
                    contact: 'contact',
                    content: 'content',
                    field: 'field',
                    portfolio: 'portfolio',
                    links: '["https://example.com"]',
                }),
            )
            const entity = await proposalsRepository().create({
                ownerId: idea.ownerId,
                networkId: NETWORKS.POLKADOT,
                blockchainProposalId: 0,
                details,
            })
            await proposalsRepository().save(entity)

            const result = await proposalsService().findOne(0, NETWORKS.POLKADOT)

            expect(result.entity!.details.title).toBe('title')
            expect(result.entity!.details.contact).toBe('contact')
            expect(result.entity!.details.content).toBe('content')
            expect(result.entity!.details.field).toBe('field')
            expect(result.entity!.details.portfolio).toBe('portfolio')
            expect(result.entity!.details.links).toBe('["https://example.com"]')
            expect(result.entity!.ownerId).toBe(idea.ownerId)
            expect(result.entity!.blockchainProposalId).toBe(0)
        })

        it('should return idea details for proposal created from idea', async () => {
            const { idea, ideaNetwork } = await setUpIdea(app())
            await proposalsService().createFromIdea(idea, 0, ideaNetwork)

            const proposal = await proposalsService().findOne(0, NETWORKS.POLKADOT)

            expect(proposal.isCreatedFromIdea).toBe(true)
            expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal.ideaId).toBe(idea.id)
            expect(proposal.ideaMilestoneId).toBeUndefined()
        })

        it('should return idea milestone details for proposal created from idea milestone', async () => {
            const { ideaWithMilestone, ideaMilestone, ideaMilestoneNetwork } = await setUpIdeaWithMilestone(app())
            await proposalsService().createFromMilestone(ideaWithMilestone, 1, ideaMilestoneNetwork, ideaMilestone)

            const proposal = await proposalsService().findOne(1, NETWORKS.POLKADOT)

            expect(proposal.isCreatedFromIdea).toBe(false)
            expect(proposal.isCreatedFromIdeaMilestone).toBe(true)
            expect(proposal.ideaId).toBe(ideaWithMilestone.id)
            expect(proposal.ideaMilestoneId).toBe(ideaMilestone.id)
        })

        it('should not return idea nor idea milestone details for proposal created externally', async () => {
            const proposal = await proposalsService().findOne(3, NETWORKS.POLKADOT)

            expect(proposal.entity).toBeUndefined()
            expect(proposal.isCreatedFromIdea).toBe(false)
            expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal.ideaId).toBeUndefined()
            expect(proposal.ideaMilestoneId).toBeUndefined()
        })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(proposalsService().findOne(100, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })

        it('should throw not found for proposal with wrong network name', async () => {
            await expect(proposalsService().findOne(0, NETWORKS.KUSAMA)).rejects.toThrow(NotFoundException)
        })
    })

    describe('create from idea', () => {
        it("should create proposal entity and copy idea's details", async () => {
            const { idea, ideaNetwork } = await setUpIdea(app(), undefined, {
                details: {
                    title: 'title',
                    contact: 'contact',
                    content: 'content',
                    field: 'field',
                    portfolio: 'portfolio',
                    links: ['https://example.com'],
                },
            })

            await proposalsService().createFromIdea(idea, 3, ideaNetwork)

            const savedProposal = await proposalsRepository().findOne({ ideaNetworkId: ideaNetwork.id })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.details.id).not.toBe(idea.details.id)
            expect(savedProposal!.details.title).toBe('title')
            expect(savedProposal!.details.contact).toBe('contact')
            expect(savedProposal!.details.content).toBe('content')
            expect(savedProposal!.details.field).toBe('field')
            expect(savedProposal!.details.portfolio).toBe('portfolio')
            expect(savedProposal!.details.links).toBe('["https://example.com"]')
        })

        it('should create proposal entity and save ownerId, ideaNetworkId and networkId', async () => {
            const { ideaNetwork, idea } = await setUpIdea(app())

            await proposalsService().createFromIdea(idea, 3, ideaNetwork)

            const savedProposal = await proposalsRepository().findOne({ ideaNetworkId: ideaNetwork.id })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.ownerId).toBe(idea.ownerId)
            expect(savedProposal!.ideaNetworkId).toBe(ideaNetwork.id)
            expect(savedProposal!.networkId).toBe(ideaNetwork.name)
        })

        it('should create proposal entity and save blockchainProposalId', async () => {
            const { ideaNetwork, idea } = await setUpIdea(app())

            await proposalsService().createFromIdea(idea, 3, ideaNetwork)

            const savedProposal = await proposalsRepository().findOne({ ideaNetworkId: ideaNetwork.id })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.blockchainProposalId).toBe(3)
        })

        it('should create proposal milestones and copy details', async () => {
            const { ideaWithMilestone, ideaWithMilestoneNetwork, sessionHandler } = await setUpIdeaWithMilestone(
                app(),
                undefined,
                {},
                {
                    details: {
                        subject: 'subject',
                        description: 'description',
                        dateFrom: new Date(2021, 3, 20),
                        dateTo: new Date(2021, 3, 21),
                    },
                },
            )
            const secondMilestone = await createIdeaMilestone(
                ideaWithMilestone.id,
                {
                    networks: [
                        {
                            name: 'localhost',
                            value: '100' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    ],
                    details: { subject: 'subject1' },
                },
                sessionHandler.sessionData,
            )
            ideaWithMilestone.milestones.push(secondMilestone)

            await proposalsService().createFromIdea(ideaWithMilestone, 3, ideaWithMilestoneNetwork)

            const savedProposal = await proposalsRepository().findOne({
                where: { ideaNetworkId: ideaWithMilestoneNetwork.id },
                relations: ['milestones'],
            })

            expect(savedProposal!.milestones).toBeDefined()
            expect(savedProposal!.milestones!.length).toBe(2)

            const savedMilestone1 = savedProposal!.milestones![0]
            expect(savedMilestone1.details.subject).toBe('subject')
            expect(savedMilestone1.details.description).toBe('description')
            expect(savedMilestone1.details.dateFrom).toBe('2021-04-20')
            expect(savedMilestone1.details.dateTo).toBe('2021-04-21')

            const savedMilestone2 = savedProposal!.milestones![1]
            expect(savedMilestone2.details.subject).toBe('subject1')
            expect(savedMilestone2.details.description).toBe(null)
            expect(savedMilestone2.details.dateFrom).toBe(null)
            expect(savedMilestone2.details.dateTo).toBe(null)
        })

        it('should create proposal milestones and save the createdBy order', async () => {
            const { idea, ideaNetwork, sessionHandler } = await setUpIdea(app(), undefined, {})
            const networks = [
                {
                    name: NETWORKS.POLKADOT,
                    value: '100' as NetworkPlanckValue,
                    status: IdeaMilestoneNetworkStatus.Active,
                },
            ]

            const createMilestone = async (subject: string) => {
                const milestone = await createIdeaMilestone(
                    idea.id,
                    {
                        networks,
                        details: { subject },
                    },
                    sessionHandler.sessionData,
                )
                idea.milestones.push(milestone)
            }

            await createMilestone('1')
            await createMilestone('2')
            await createMilestone('3')
            await createMilestone('4')
            await createMilestone('5')

            const savedProposal = await proposalsService().createFromIdea(idea, 3, ideaNetwork)

            const proposalMilestonesRepository = app().get<Repository<ProposalMilestoneEntity>>(
                getRepositoryToken(ProposalMilestoneEntity),
            )

            const milestones = await proposalMilestonesRepository.find({
                where: { proposalId: savedProposal.id },
                order: { createdAt: 'ASC' },
            })

            expect(milestones[0].details.subject).toBe('1')
            expect(milestones[1].details.subject).toBe('2')
            expect(milestones[2].details.subject).toBe('3')
            expect(milestones[3].details.subject).toBe('4')
            expect(milestones[4].details.subject).toBe('5')
        })

        it('should return proposal entity', async () => {
            const {
                idea,
                ideaNetwork,
                sessionHandler: { sessionData },
            } = await setUpIdea(app())

            const proposal = await proposalsService().createFromIdea(idea, 3, ideaNetwork)

            expect(proposal).toBeDefined()
            expect(proposal!.ownerId).toBe(sessionData.user.id)
            expect(proposal!.ideaNetworkId).toBe(ideaNetwork.id)
            expect(proposal!.networkId).toBe(ideaNetwork.name)
            expect(proposal!.blockchainProposalId).toBe(3)
            expect(proposal!.details).toBeDefined()
        })
    })

    describe('create from milestone', () => {
        it("should create proposal entity and copy idea's and milestone's details", async () => {
            const { ideaWithMilestone, ideaMilestone, ideaMilestoneNetwork } = await setUpIdeaWithMilestone(
                app(),
                undefined,
                {
                    details: {
                        title: 'title',
                        contact: 'contact',
                        content: 'content',
                        field: 'field',
                        portfolio: 'portfolio',
                        links: ['https://example.com'],
                    },
                },
                {
                    details: {
                        subject: 'subject',
                        dateFrom: new Date(2021, 3, 20),
                        dateTo: new Date(2021, 3, 21),
                        description: 'description',
                    },
                },
            )

            await proposalsService().createFromMilestone(ideaWithMilestone, 3, ideaMilestoneNetwork, ideaMilestone)

            const savedProposal = await proposalsRepository().findOne({
                ideaMilestoneNetworkId: ideaMilestoneNetwork.id,
            })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.details.id).not.toBe(ideaWithMilestone.details.id)
            expect(savedProposal!.details.title).toBe('title - subject')
            expect(savedProposal!.details.contact).toBe('contact')
            expect(savedProposal!.details.field).toBe('field')
            expect(savedProposal!.details.portfolio).toBe('portfolio')
            expect(savedProposal!.details.links).toBe('["https://example.com"]')
            expect(savedProposal!.details.content).toBe('content\n2021-04-20 - 2021-04-21\ndescription')
        })

        it('should create proposal entity and save ownerId, ideaMilestoneNetworkId and networkId', async () => {
            const { ideaMilestoneNetwork, ideaWithMilestone, ideaMilestone } = await setUpIdeaWithMilestone(app())

            await proposalsService().createFromMilestone(ideaWithMilestone, 3, ideaMilestoneNetwork, ideaMilestone)

            const savedProposal = await proposalsRepository().findOne({
                ideaMilestoneNetworkId: ideaMilestoneNetwork.id,
            })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.ownerId).toBe(ideaWithMilestone.ownerId)
            expect(savedProposal!.ideaNetworkId).toBe(null)
            expect(savedProposal!.ideaMilestoneNetworkId).toBe(ideaMilestoneNetwork.id)
            expect(savedProposal!.networkId).toBe(ideaMilestoneNetwork.name)
        })

        it('should create proposal entity and save blockchainProposalId', async () => {
            const { ideaMilestoneNetwork, ideaWithMilestone, ideaMilestone } = await setUpIdeaWithMilestone(app())

            await proposalsService().createFromMilestone(ideaWithMilestone, 3, ideaMilestoneNetwork, ideaMilestone)

            const savedProposal = await proposalsRepository().findOne({
                ideaMilestoneNetworkId: ideaMilestoneNetwork.id,
            })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.blockchainProposalId).toBe(3)
        })

        it('should return proposal entity', async () => {
            const {
                ideaMilestoneNetwork,
                ideaWithMilestone,
                ideaMilestone,
                sessionHandler: { sessionData },
            } = await setUpIdeaWithMilestone(app())

            const proposal = await proposalsService().createFromMilestone(
                ideaWithMilestone,
                3,
                ideaMilestoneNetwork,
                ideaMilestone,
            )

            expect(proposal).toBeDefined()
            expect(proposal!.ownerId).toBe(sessionData.user.id)
            expect(proposal!.ideaNetworkId).toBe(null)
            expect(proposal!.ideaMilestoneNetworkId).toBe(ideaMilestoneNetwork.id)
            expect(proposal!.networkId).toBe(ideaMilestoneNetwork.name)
            expect(proposal!.blockchainProposalId).toBe(3)
            expect(proposal!.details).toBeDefined()
        })
    })
})
