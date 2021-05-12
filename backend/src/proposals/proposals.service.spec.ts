import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { IdeaNetwork } from '../ideas/entities/ideaNetwork.entity'
import { createIdea, createIdeaMilestone, createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { ProposalsService } from './proposals.service'
import { mockedBlockchainService } from './spec.helpers'
import { Idea } from '../ideas/entities/idea.entity'
import { IdeaMilestone } from '../ideas/ideaMilestones/entities/idea.milestone.entity'
import { v4 as uuid } from 'uuid'
import { CreateIdeaMilestoneDto } from '../ideas/ideaMilestones/dto/createIdeaMilestoneDto'
import { IdeaMilestoneNetwork } from '../ideas/ideaMilestones/entities/idea.milestone.network.entity'
import { ExtendedBlockchainProposal } from '../blockchain/dto/blockchainProposal.dto'
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
                title: 'title',
                beneficiary: uuid(),
                networks: [{ name: 'localhost', value: 10 }],
            },
            sessionData,
        )

        idea.networks[0].blockchainProposalId = 0
        await ideaNetworkRepository().save(idea.networks[0])

        const otherIdea = await createIdea(
            {
                title: 'title',
                beneficiary: uuid(),
                networks: [{ name: 'localhost', value: 10 }],
            },
            sessionData,
        )

        ideaMilestone = await createIdeaMilestone(
            otherIdea.id,
            new CreateIdeaMilestoneDto(
                'subject',
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

            const proposal1 = proposals.find(({ proposalIndex }: ExtendedBlockchainProposal) => proposalIndex === 0)

            expect(proposal1).toBeDefined()
            expect(proposal1!.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal1!.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal1!.bond).toBe(0.001)
            expect(proposal1!.value).toBe(0.00000000000001)
            expect(proposal1!.status).toBe('proposal')
            expect(proposal1!.idea).toBeDefined()
            expect(proposal1!.idea!.id).toBe(idea.id)
            expect(proposal1!.ideaMilestone).toBeUndefined()

            const proposal2 = proposals.find(({ proposalIndex }: ExtendedBlockchainProposal) => proposalIndex === 1)

            expect(proposal2).toBeDefined()
            expect(proposal2!.proposer).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal2!.beneficiary).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal2!.bond).toBe(40)
            expect(proposal2!.value).toBe(2000)
            expect(proposal2!.status).toBe('proposal')
            expect(proposal2!.idea).toBeUndefined()
            expect(proposal2!.ideaMilestone).toBeDefined()
            expect(proposal2!.ideaMilestone!.id).toBe(ideaMilestone.id)

            const proposal3 = proposals.find(({ proposalIndex }: ExtendedBlockchainProposal) => proposalIndex === 3)

            expect(proposal3!.proposer).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal3!.beneficiary).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal3!.bond).toBe(20)
            expect(proposal3!.value).toBe(1000)
            expect(proposal3!.status).toBe('approval')
            expect(proposal3!.idea).toBeUndefined()
            expect(proposal3!.ideaMilestone).toBeUndefined()
        })
    })

    describe('findOne', () => {
        it('should return proposal details', async () => {
            const proposal = await proposalsService().findOne(0, 'localhost')

            expect(proposal).toBeDefined()
            expect(proposal.proposalIndex).toBe(0)
            expect(proposal.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal.bond).toBe(0.001)
            expect(proposal.value).toBe(0.00000000000001)
            expect(proposal.status).toBe('proposal')
        })

        it('should return idea details for proposal created from idea', async () => {
            const proposal = await proposalsService().findOne(0, 'localhost')

            expect(proposal.idea).toBeDefined()
            expect(proposal.idea!.id).toBe(idea.id)
        })

        it('should not return idea details for proposal created from idea and wrong network name', async () => {
            const proposal = await proposalsService().findOne(0, 'otherNetwork')

            expect(proposal.idea).toBeUndefined()
        })

        it('should return idea milestone details for proposal created from idea milestone', async () => {
            const proposal = await proposalsService().findOne(1, 'localhost')

            expect(proposal.ideaMilestone).toBeDefined()
            expect(proposal.ideaMilestone!.id).toBe(ideaMilestone.id)
        })

        it('should not return idea milestone details for proposal created from idea milestone and wrong network name', async () => {
            const proposal = await proposalsService().findOne(1, 'otherNetwork')

            expect(proposal.ideaMilestone).toBeUndefined()
        })

        it('should not return idea nor idea milestone details for proposal created externally', async () => {
            const proposal = await proposalsService().findOne(3, 'localhost')

            expect(proposal.idea).toBeUndefined()
            expect(proposal.ideaMilestone).toBeUndefined()
        })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(proposalsService().findOne(100, 'localhost')).rejects.toThrow(NotFoundException)
        })
    })
})
