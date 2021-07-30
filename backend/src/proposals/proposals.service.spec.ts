import { NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../blockchain/blockchain.service'
import { IdeaProposalDetails } from '../idea-proposal-details/idea-proposal-details.entity'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { Proposal } from './entities/proposal.entity'
import { ProposalsService } from './proposals.service'
import { mockedBlockchainService, setUpValues } from './spec.helpers'

describe('ProposalsService', () => {
    const app = beforeSetupFullApp()

    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))
    const proposalsRepository = beforeAllSetup(() => app().get<Repository<Proposal>>(getRepositoryToken(Proposal)))
    const detailsRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaProposalDetails>>(getRepositoryToken(IdeaProposalDetails)),
    )

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
        jest.spyOn(app().get(BlockchainService), 'listenForExtrinsic').mockImplementation(
            mockedBlockchainService.listenForExtrinsic,
        )
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
            const { ideaWithMilestone, idea, ideaMilestone, ideaMilestoneNetwork, ideaNetwork } = await setUpValues(
                app(),
            )
            await proposalsService().create(idea, 0, ideaNetwork)
            await proposalsService().create(ideaWithMilestone, 1, ideaMilestoneNetwork, ideaMilestone)

            const proposals = await proposalsService().find(NETWORKS.POLKADOT)
            expect(proposals.length).toBe(3)

            const proposal1 = proposals.find(({ blockchain: { proposalIndex } }) => proposalIndex === 0)

            expect(proposal1).toBeDefined()
            expect(proposal1!.blockchain.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal1!.blockchain.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal1!.blockchain.bond).toBe(0.001)
            expect(proposal1!.blockchain.value).toBe(0.00000000000001)
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
            expect(proposal2!.blockchain.bond).toBe(40)
            expect(proposal2!.blockchain.value).toBe(2000)
            expect(proposal2!.blockchain.status).toBe('proposal')
            expect(proposal2!.blockchain.motions).toBeDefined()
            expect(proposal2!.entity!.details.title).toBe('ideaWithMilestoneTitle - milestoneSubject')
            expect(proposal2!.isCreatedFromIdea).toBe(false)
            expect(proposal2!.isCreatedFromIdeaMilestone).toBe(true)
            expect(proposal2!.ideaId).toBe(ideaWithMilestone.id)
            expect(proposal2!.ideaMilestoneId).toBe(ideaMilestone.id)

            const proposal3 = proposals.find(({ blockchain: { proposalIndex } }) => proposalIndex === 3)
            expect(proposal3!.blockchain.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal3!.blockchain.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal3!.blockchain.bond).toBe(20)
            expect(proposal3!.blockchain.value).toBe(1000)
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
            expect(proposal.blockchain.bond).toBe(0.001)
            expect(proposal.blockchain.value).toBe(0.00000000000001)
            expect(proposal.blockchain.status).toBe('proposal')
        })

        it('should return proposal entity details', async () => {
            const { idea } = await setUpValues(app())
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

        it('should not return proposal with wrong network name', async () => {
            const proposal = await proposalsService().findOne(0, NETWORKS.KUSAMA)

            expect(proposal.entity).toBeUndefined()
            expect(proposal.isCreatedFromIdea).toBe(false)
            expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal.ideaId).toBeUndefined()
            expect(proposal.ideaMilestoneId).toBeUndefined()
        })

        it('should return idea details for proposal created from idea', async () => {
            const { idea, ideaNetwork } = await setUpValues(app())
            await proposalsService().create(idea, 0, ideaNetwork)

            const proposal = await proposalsService().findOne(0, NETWORKS.POLKADOT)

            expect(proposal.isCreatedFromIdea).toBe(true)
            expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal.ideaId).toBe(idea.id)
            expect(proposal.ideaMilestoneId).toBeUndefined()
        })

        it('should return idea milestone details for proposal created from idea milestone', async () => {
            const { ideaWithMilestone, ideaMilestone, ideaMilestoneNetwork } = await setUpValues(app())
            await proposalsService().create(ideaWithMilestone, 1, ideaMilestoneNetwork, ideaMilestone)

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
    })

    describe('create from idea', () => {
        it("should create proposal entity and copy idea's details", async () => {
            const { idea, ideaNetwork } = await setUpValues(app(), {
                details: {
                    title: 'title',
                    contact: 'contact',
                    content: 'content',
                    field: 'field',
                    portfolio: 'portfolio',
                    links: ['https://example.com'],
                },
            })

            await proposalsService().create(idea, 3, ideaNetwork)

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
            const { ideaNetwork, idea } = await setUpValues(app())

            await proposalsService().create(idea, 3, ideaNetwork)

            const savedProposal = await proposalsRepository().findOne({ ideaNetworkId: ideaNetwork.id })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.ownerId).toBe(idea.ownerId)
            expect(savedProposal!.ideaNetworkId).toBe(ideaNetwork.id)
            expect(savedProposal!.networkId).toBe(ideaNetwork.name)
        })

        it('should create proposal entity and save blockchainProposalId', async () => {
            const { ideaNetwork, idea } = await setUpValues(app())

            await proposalsService().create(idea, 3, ideaNetwork)

            const savedProposal = await proposalsRepository().findOne({ ideaNetworkId: ideaNetwork.id })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.blockchainProposalId).toBe(3)
        })

        it('should return proposal entity', async () => {
            const {
                idea,
                ideaNetwork,
                sessionHandler: { sessionData },
            } = await setUpValues(app())

            const proposal = await proposalsService().create(idea, 3, ideaNetwork)

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
            const { idea, ideaMilestone, ideaMilestoneNetwork } = await setUpValues(
                app(),
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

            await proposalsService().create(idea, 3, ideaMilestoneNetwork, ideaMilestone)

            const savedProposal = await proposalsRepository().findOne({
                ideaMilestoneNetworkId: ideaMilestoneNetwork.id,
            })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.details.id).not.toBe(idea.details.id)
            expect(savedProposal!.details.title).toBe('title - subject')
            expect(savedProposal!.details.contact).toBe('contact')
            expect(savedProposal!.details.field).toBe('field')
            expect(savedProposal!.details.portfolio).toBe('portfolio')
            expect(savedProposal!.details.links).toBe('["https://example.com"]')
            expect(savedProposal!.details.content).toBe('content\n2021-04-20 - 2021-04-21\ndescription')
        })

        it('should create proposal entity and save ownerId, ideaMilestoneNetworkId and networkId', async () => {
            const { ideaMilestoneNetwork, idea, ideaMilestone } = await setUpValues(app())

            await proposalsService().create(idea, 3, ideaMilestoneNetwork, ideaMilestone)

            const savedProposal = await proposalsRepository().findOne({
                ideaMilestoneNetworkId: ideaMilestoneNetwork.id,
            })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.ownerId).toBe(idea.ownerId)
            expect(savedProposal!.ideaNetworkId).toBe(null)
            expect(savedProposal!.ideaMilestoneNetworkId).toBe(ideaMilestoneNetwork.id)
            expect(savedProposal!.networkId).toBe(ideaMilestoneNetwork.name)
        })

        it('should create proposal entity and save blockchainProposalId', async () => {
            const { ideaMilestoneNetwork, ideaWithMilestone, ideaMilestone } = await setUpValues(app())

            await proposalsService().create(ideaWithMilestone, 3, ideaMilestoneNetwork, ideaMilestone)

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
            } = await setUpValues(app())

            const proposal = await proposalsService().create(ideaWithMilestone, 3, ideaMilestoneNetwork, ideaMilestone)

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
