import { NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../blockchain/blockchain.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { Proposal } from './entities/proposal.entity'
import { BlockchainProposalWithDomainDetails, ProposalsService } from './proposals.service'
import { mockedBlockchainService, setUpValues } from './spec.helpers'

describe('ProposalsService', () => {
    const app = beforeSetupFullApp()

    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))
    const proposalsRepository = beforeAllSetup(() => app().get<Repository<Proposal>>(getRepositoryToken(Proposal)))

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

    // describe('find', () => {
    //     it('should return proposals', async () => {
    //         const { otherIdea, idea, ideaMilestone } = await setUpValues(app())
    //         const proposals = await proposalsService().find(NETWORKS.POLKADOT)
    //         expect(proposals.length).toBe(3)
    //
    //         const proposal1 = proposals.find(
    //             ({ proposalIndex }: BlockchainProposalWithDomainDetails) => proposalIndex === 0,
    //         )
    //
    //         expect(proposal1).toBeDefined()
    //         expect(proposal1!.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
    //         expect(proposal1!.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
    //         expect(proposal1!.bond).toBe(0.001)
    //         expect(proposal1!.value).toBe(0.00000000000001)
    //         expect(proposal1!.status).toBe('proposal')
    //         expect(proposal1!.title).toBe('ideaTitle')
    //         expect(proposal1!.isCreatedFromIdea).toBe(true)
    //         expect(proposal1!.isCreatedFromIdeaMilestone).toBe(false)
    //         expect(proposal1!.ideaId).toBe(idea.id)
    //         expect(proposal1!.ideaMilestoneId).toBeUndefined()
    //         expect(proposal1!.motions).toBeDefined()
    //         const proposal2 = proposals.find(
    //             ({ proposalIndex }: BlockchainProposalWithDomainDetails) => proposalIndex === 1,
    //         )
    //
    //         expect(proposal2).toBeDefined()
    //         expect(proposal2!.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
    //         expect(proposal2!.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
    //         expect(proposal2!.bond).toBe(40)
    //         expect(proposal2!.value).toBe(2000)
    //         expect(proposal2!.status).toBe('proposal')
    //         expect(proposal2!.title).toBe('ideaMilestoneSubject')
    //         expect(proposal2!.isCreatedFromIdea).toBe(false)
    //         expect(proposal2!.isCreatedFromIdeaMilestone).toBe(true)
    //         expect(proposal2!.ideaId).toBe(otherIdea.id)
    //         expect(proposal2!.ideaMilestoneId).toBe(ideaMilestone.id)
    //         expect(proposal2!.motions).toBeDefined()
    //         const proposal3 = proposals.find(
    //             ({ proposalIndex }: BlockchainProposalWithDomainDetails) => proposalIndex === 3,
    //         )
    //
    //         expect(proposal3!.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
    //         expect(proposal3!.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
    //         expect(proposal3!.bond).toBe(20)
    //         expect(proposal3!.value).toBe(1000)
    //         expect(proposal3!.status).toBe('approval')
    //         expect(proposal3!.title).toBeUndefined()
    //         expect(proposal3!.isCreatedFromIdea).toBe(false)
    //         expect(proposal3!.isCreatedFromIdeaMilestone).toBe(false)
    //         expect(proposal3!.ideaId).toBeUndefined()
    //         expect(proposal3!.ideaMilestoneId).toBeUndefined()
    //         expect(proposal3!.motions).toBeDefined()
    //     })
    // })

    describe('findOne', () => {
        it('should return proposal details', async () => {
            const proposal = await proposalsService().findOne(0, NETWORKS.POLKADOT)

            expect(proposal).toBeDefined()
            expect(proposal.proposalIndex).toBe(0)
            expect(proposal.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal.bond).toBe(0.001)
            expect(proposal.value).toBe(0.00000000000001)
            expect(proposal.status).toBe('proposal')
        })

        it('should return idea details for proposal created from idea', async () => {
            const { idea, ideaNetwork } = await setUpValues(app())
            const proposal = await proposalsService().create(ideaNetwork, idea, 0)

            const result = await proposalsService().findOne(0, NETWORKS.POLKADOT)

            expect(result.title).toBe('ideaTitle')
            expect(result.isCreatedFromIdea).toBe(true)
            expect(result.ideaId).toBe(idea.id)
        })

        // it('should not return proposal with wrong network name', async () => {
        //     const proposal = await proposalsService().findOne(0, 'otherNetwork')
        //
        //     expect(proposal.title).toBeUndefined()
        //     expect(proposal.isCreatedFromIdea).toBe(false)
        //     expect(proposal.ideaId).toBeUndefined()
        // })

        // it('should return idea milestone details for proposal created from idea milestone', async () => {
        //     const { otherIdea, ideaMilestone } = await setUpValues(app())
        //     const proposal = await proposalsService().findOne(1, NETWORKS.POLKADOT)
        //
        //     expect(proposal.title).toBe('ideaMilestoneSubject')
        //     expect(proposal.isCreatedFromIdeaMilestone).toBe(true)
        //     expect(proposal.ideaId).toBe(otherIdea.id)
        //     expect(proposal.ideaMilestoneId).toBe(ideaMilestone.id)
        // })
        //
        // it('should not return idea milestone details for proposal created from idea milestone and wrong network name', async () => {
        //     const proposal = await proposalsService().findOne(1, NETWORKS.KUSAMA)
        //
        //     expect(proposal.title).toBeUndefined()
        //     expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
        //     expect(proposal.ideaId).toBeUndefined()
        //     expect(proposal.ideaMilestoneId).toBeUndefined()
        // })
        //
        // it('should not return idea nor idea milestone details for proposal created externally', async () => {
        //     const proposal = await proposalsService().findOne(3, NETWORKS.POLKADOT)
        //
        //     expect(proposal.title).toBeUndefined()
        //     expect(proposal.isCreatedFromIdea).toBe(false)
        //     expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
        //     expect(proposal.ideaId).toBeUndefined()
        //     expect(proposal.ideaMilestoneId).toBeUndefined()
        // })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(proposalsService().findOne(100, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })
    })

    describe('create', () => {
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

            await proposalsService().create(ideaNetwork, idea, 3)

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

            await proposalsService().create(ideaNetwork, idea, 3)

            const savedProposal = await proposalsRepository().findOne({ ideaNetworkId: ideaNetwork.id })

            expect(savedProposal).toBeDefined()
            expect(savedProposal!.ownerId).toBe(idea.ownerId)
            expect(savedProposal!.ideaNetworkId).toBe(ideaNetwork.id)
            expect(savedProposal!.networkId).toBe(ideaNetwork.name)
        })

        it('should create proposal entity and save blockchainProposalId', async () => {
            const { ideaNetwork, idea } = await setUpValues(app())

            await proposalsService().create(ideaNetwork, idea, 3)

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

            const proposal = await proposalsService().create(ideaNetwork, idea, 3)

            expect(proposal).toBeDefined()
            expect(proposal!.ownerId).toBe(sessionData.user.id)
            expect(proposal!.ideaNetworkId).toBe(ideaNetwork.id)
            expect(proposal!.networkId).toBe(ideaNetwork.name)
            expect(proposal!.blockchainProposalId).toBe(3)
            expect(proposal!.details).toBeDefined()
        })
    })
})
