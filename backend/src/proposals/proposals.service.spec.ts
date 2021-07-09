import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { IdeaNetwork } from '../ideas/entities/idea-network.entity'
import { createIdea, createIdeaMilestone, createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { BlockchainProposalWithDomainDetails, ProposalsService } from './proposals.service'
import { mockedBlockchainService } from './spec.helpers'
import { Idea } from '../ideas/entities/idea.entity'
import { IdeaMilestone } from '../ideas/idea-milestones/entities/idea-milestone.entity'
import { v4 as uuid } from 'uuid'
import { CreateIdeaMilestoneDto } from '../ideas/idea-milestones/dto/create-idea-milestone.dto'
import { IdeaMilestoneNetwork } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { NotFoundException } from '@nestjs/common'

describe('ProposalsService', () => {
    const app = beforeSetupFullApp()

    const proposalsService = beforeAllSetup(() => app().get<ProposalsService>(ProposalsService))

    const ideaNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)),
    )

    const ideaMilestoneNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaMilestoneNetwork>>(getRepositoryToken(IdeaMilestoneNetwork)),
    )

    let idea: Idea
    let otherIdea: Idea
    let ideaMilestone: IdeaMilestone

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
    })

    beforeEach(async () => {
        await cleanDatabase()

        const sessionData = await createSessionData()

        idea = await createIdea(
            {
                details: { title: 'ideaTitle' },
                beneficiary: uuid(),
                networks: [{ name: 'localhost', value: 10 }],
            },
            sessionData,
        )

        idea.networks[0].blockchainProposalId = 0
        await ideaNetworkRepository().save(idea.networks[0])

        otherIdea = await createIdea(
            {
                details: { title: 'otherIdeaTitle' },
                beneficiary: uuid(),
                networks: [{ name: 'localhost', value: 10 }],
            },
            sessionData,
        )

        ideaMilestone = await createIdeaMilestone(
            otherIdea.id,
            new CreateIdeaMilestoneDto(
                'ideaMilestoneSubject',
                [{ name: 'localhost', value: 100 }],
                uuid(),
                null,
                null,
                'description',
            ),
            sessionData,
        )

        ideaMilestone.networks[0].blockchainProposalId = 1
        await ideaMilestoneNetworkRepository().save(ideaMilestone.networks[0])
    })

    describe('find', () => {
        it('should return proposals', async () => {
            const proposals = await proposalsService().find('localhost')
            expect(proposals.length).toBe(3)

            const proposal1 = proposals.find(
                ({ proposalIndex }: BlockchainProposalWithDomainDetails) => proposalIndex === 0,
            )

            expect(proposal1).toBeDefined()
            expect(proposal1!.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal1!.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal1!.bond).toBe(0.001)
            expect(proposal1!.value).toBe(0.00000000000001)
            expect(proposal1!.status).toBe('proposal')
            expect(proposal1!.title).toBe('ideaTitle')
            expect(proposal1!.isCreatedFromIdea).toBe(true)
            expect(proposal1!.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal1!.ideaId).toBe(idea.id)
            expect(proposal1!.ideaMilestoneId).toBeUndefined()
            expect(proposal1!.motions).toBeDefined()
            const proposal2 = proposals.find(
                ({ proposalIndex }: BlockchainProposalWithDomainDetails) => proposalIndex === 1,
            )

            expect(proposal2).toBeDefined()
            expect(proposal2!.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal2!.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal2!.bond).toBe(40)
            expect(proposal2!.value).toBe(2000)
            expect(proposal2!.status).toBe('proposal')
            expect(proposal2!.title).toBe('ideaMilestoneSubject')
            expect(proposal2!.isCreatedFromIdea).toBe(false)
            expect(proposal2!.isCreatedFromIdeaMilestone).toBe(true)
            expect(proposal2!.ideaId).toBe(otherIdea.id)
            expect(proposal2!.ideaMilestoneId).toBe(ideaMilestone.id)
            expect(proposal2!.motions).toBeDefined()
            const proposal3 = proposals.find(
                ({ proposalIndex }: BlockchainProposalWithDomainDetails) => proposalIndex === 3,
            )

            expect(proposal3!.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal3!.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal3!.bond).toBe(20)
            expect(proposal3!.value).toBe(1000)
            expect(proposal3!.status).toBe('approval')
            expect(proposal3!.title).toBeUndefined()
            expect(proposal3!.isCreatedFromIdea).toBe(false)
            expect(proposal3!.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal3!.ideaId).toBeUndefined()
            expect(proposal3!.ideaMilestoneId).toBeUndefined()
            expect(proposal3!.motions).toBeDefined()
        })
    })

    describe('findOne', () => {
        it('should return proposal details', async () => {
            const proposal = await proposalsService().findOne(0, 'localhost')

            expect(proposal).toBeDefined()
            expect(proposal.proposalIndex).toBe(0)
            expect(proposal.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal.bond).toBe(0.001)
            expect(proposal.value).toBe(0.00000000000001)
            expect(proposal.status).toBe('proposal')
        })

        it('should return idea details for proposal created from idea', async () => {
            const proposal = await proposalsService().findOne(0, 'localhost')

            expect(proposal.title).toBe('ideaTitle')
            expect(proposal.isCreatedFromIdea).toBe(true)
            expect(proposal.ideaId).toBe(idea.id)
        })

        it('should not return idea details for proposal created from idea and wrong network name', async () => {
            const proposal = await proposalsService().findOne(0, 'otherNetwork')

            expect(proposal.title).toBeUndefined()
            expect(proposal.isCreatedFromIdea).toBe(false)
            expect(proposal.ideaId).toBeUndefined()
        })

        it('should return idea milestone details for proposal created from idea milestone', async () => {
            const proposal = await proposalsService().findOne(1, 'localhost')

            expect(proposal.title).toBe('ideaMilestoneSubject')
            expect(proposal.isCreatedFromIdeaMilestone).toBe(true)
            expect(proposal.ideaId).toBe(otherIdea.id)
            expect(proposal.ideaMilestoneId).toBe(ideaMilestone.id)
        })

        it('should not return idea milestone details for proposal created from idea milestone and wrong network name', async () => {
            const proposal = await proposalsService().findOne(1, 'otherNetwork')

            expect(proposal.title).toBeUndefined()
            expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal.ideaId).toBeUndefined()
            expect(proposal.ideaMilestoneId).toBeUndefined()
        })

        it('should not return idea nor idea milestone details for proposal created externally', async () => {
            const proposal = await proposalsService().findOne(3, 'localhost')

            expect(proposal.title).toBeUndefined()
            expect(proposal.isCreatedFromIdea).toBe(false)
            expect(proposal.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal.ideaId).toBeUndefined()
            expect(proposal.ideaMilestoneId).toBeUndefined()
        })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(proposalsService().findOne(100, 'localhost')).rejects.toThrow(NotFoundException)
        })
    })
})
