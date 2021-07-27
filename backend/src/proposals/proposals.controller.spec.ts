import { getRepositoryToken } from '@nestjs/typeorm'
import { BlockchainService } from '../blockchain/blockchain.service'
import { Idea } from '../ideas/entities/idea.entity'
import { IdeaNetwork } from '../ideas/entities/idea-network.entity'
import { createIdea, createIdeaMilestone, createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { ProposalDto } from './dto/proposal.dto'
import { mockedBlockchainService } from './spec.helpers'
import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { CreateIdeaMilestoneDto } from '../ideas/idea-milestones/dto/create-idea-milestone.dto'
import { IdeaMilestoneNetwork } from '../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { IdeaMilestone } from '../ideas/idea-milestones/entities/idea-milestone.entity'
import { Repository } from 'typeorm'

const baseUrl = '/api/v1/proposals'

describe(`/api/v1/proposals`, () => {
    const app = beforeSetupFullApp()

    let idea: Idea
    let otherIdea: Idea
    let ideaMilestone: IdeaMilestone

    const ideaNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaNetwork>>(getRepositoryToken(IdeaNetwork)),
    )

    const ideaMilestoneNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaMilestoneNetwork>>(getRepositoryToken(IdeaMilestoneNetwork)),
    )

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
                networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
            },
            sessionData,
        )
        idea.networks[0].blockchainProposalId = 0
        await ideaNetworkRepository().save(idea.networks[0])
        otherIdea = await createIdea(
            {
                details: { title: 'otherIdeaTitle' },
                beneficiary: uuid(),
                networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
            },
            sessionData,
        )
        ideaMilestone = await createIdeaMilestone(
            otherIdea.id,
            {
                networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                details: {
                    subject: 'ideaMilestoneSubject',
                    description: 'description',
                },
            },
            sessionData,
        )
        ideaMilestone.networks[0].blockchainProposalId = 1
        await ideaMilestoneNetworkRepository().save(ideaMilestone.networks[0])
    })

    describe('GET /?network=networkName', () => {
        it(`should return ${HttpStatus.OK} for given network name`, () => {
            return request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not given network name`, () => {
            return request(app()).get(baseUrl).expect(HttpStatus.BAD_REQUEST)
        })

        it('should return proposals for given network', async () => {
            const result = await request(app()).get(`${baseUrl}?network=${NETWORKS.POLKADOT}`)

            const body = result.body as ProposalDto[]

            expect(body.length).toBe(3)

            const proposal1 = body.find(({ proposalIndex }: ProposalDto) => proposalIndex === 0)

            expect(proposal1).toBeDefined()
            expect(proposal1!.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(proposal1!.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(proposal1!.bond).toBe(0.001)
            expect(proposal1!.value).toBe(0.00000000000001)
            expect(proposal1!.status).toBe('submitted')
            expect(proposal1!.title).toBe('ideaTitle')
            expect(proposal1!.isCreatedFromIdea).toBe(true)
            expect(proposal1!.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal1!.ideaId).toBe(idea.id)
            expect(proposal1!.ideaMilestoneId).toBeUndefined()
            expect(proposal1!.motions).toBeDefined()
            expect(proposal1!.motions[0]).toEqual({
                hash: 'hash_0_0',
                method: 'approveProposal',
                motionIndex: 0,
                ayes: [],
                nays: [],
                threshold: 2,
                motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } },
            })

            const proposal2 = body.find(({ proposalIndex }: ProposalDto) => proposalIndex === 1)

            expect(proposal2).toBeDefined()
            expect(proposal2!.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal2!.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal2!.bond).toBe(40)
            expect(proposal2!.value).toBe(2000)
            expect(proposal2!.status).toBe('submitted')
            expect(proposal2!.title).toBe('ideaMilestoneSubject')
            expect(proposal2!.isCreatedFromIdea).toBe(false)
            expect(proposal2!.isCreatedFromIdeaMilestone).toBe(true)
            expect(proposal2!.ideaId).toBe(otherIdea.id)
            expect(proposal2!.ideaMilestoneId).toBe(ideaMilestone.id)
            expect(proposal2!.motions).toBeDefined()
            expect(proposal2!.motions[0]).toEqual({
                hash: 'hash_1_0',
                method: 'approveProposal',
                motionIndex: 1,
                ayes: [],
                nays: [],
                threshold: 2,
                motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } },
            })

            const proposal3 = body.find(({ proposalIndex }: ProposalDto) => proposalIndex === 3)

            expect(proposal3!.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(proposal3!.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(proposal3!.bond).toBe(20)
            expect(proposal3!.value).toBe(1000)
            expect(proposal3!.status).toBe('approved')
            expect(proposal3!.title).toBeUndefined()
            expect(proposal3!.isCreatedFromIdea).toBe(false)
            expect(proposal3!.isCreatedFromIdeaMilestone).toBe(false)
            expect(proposal3!.ideaId).toBeUndefined()
            expect(proposal3!.ideaMilestoneId).toBeUndefined()
            expect(proposal3!.motions).toBeDefined()
            expect(proposal3!.motions[0]).toEqual({
                hash: 'hash_3_0',
                method: 'approveProposal',
                motionIndex: 2,
                ayes: [],
                nays: [],
                threshold: 2,
                motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } },
            })
        })
    })

    describe('GET /:proposalIndex?network=:networkName', () => {
        it(`should return ${HttpStatus.OK} for given proposal index and network name`, () => {
            return request(app()).get(`${baseUrl}/0?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not given network name`, () => {
            return request(app()).get(`${baseUrl}/0`).expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid proposal index`, () => {
            return request(app())
                .get(`${baseUrl}/not-a-number?network=${NETWORKS.POLKADOT}`)
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.NOT_FOUND} for proposal index which does not exist`, () => {
            return request(app()).get(`${baseUrl}/123?network=${NETWORKS.POLKADOT}`).expect(HttpStatus.NOT_FOUND)
        })

        it('should return proposal with idea details for proposal created from idea', async () => {
            const result = await request(app()).get(`${baseUrl}/0?network=${NETWORKS.POLKADOT}`)

            const body = result.body as ProposalDto
            expect(body.proposer.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.beneficiary.address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(body.bond).toBe(0.001)
            expect(body.value).toBe(0.00000000000001)
            expect(body.status).toBe('submitted')
            expect(body.title).toBe('ideaTitle')
            expect(body.isCreatedFromIdea).toBe(true)
            expect(body.ideaId).toBe(idea.id)
            expect(body.motions).toBeDefined()
            expect(body.motions[0]).toEqual({
                hash: 'hash_0_0',
                method: 'approveProposal',
                motionIndex: 0,
                ayes: [],
                nays: [],
                threshold: 2,
                motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } },
            })
        })

        it('should return proposal with idea milestone details for proposal created from idea milestone', async () => {
            const result = await request(app()).get(`${baseUrl}/1?network=${NETWORKS.POLKADOT}`)

            const body = result.body as ProposalDto

            expect(body.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(body.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(body.bond).toBe(40)
            expect(body.value).toBe(2000)
            expect(body.status).toBe('submitted')
            expect(body.title).toBe('ideaMilestoneSubject')
            expect(body.isCreatedFromIdeaMilestone).toBe(true)
            expect(body.ideaId).toBe(otherIdea.id)
            expect(body.ideaMilestoneId).toBe(ideaMilestone.id)
            expect(body.motions).toBeDefined()
            expect(body.motions[0]).toEqual({
                hash: 'hash_1_0',
                method: 'approveProposal',
                motionIndex: 1,
                ayes: [],
                nays: [],
                threshold: 2,
                motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } },
            })
        })

        it('should return proposal without idea nor idea milestone details for proposal created externally', async () => {
            const result = await request(app()).get(`${baseUrl}/3?network=${NETWORKS.POLKADOT}`)

            const body = result.body as ProposalDto

            expect(body.proposer.address).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(body.beneficiary.address).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(body.bond).toBe(20)
            expect(body.value).toBe(1000)
            expect(body.status).toBe('approved')
            expect(body.title).toBeUndefined()
            expect(body.isCreatedFromIdea).toBe(false)
            expect(body.isCreatedFromIdeaMilestone).toBe(false)
            expect(body.ideaId).toBeUndefined()
            expect(body.ideaMilestoneId).toBeUndefined()
            expect(body.motions).toBeDefined()
            expect(body.motions[0]).toEqual({
                hash: 'hash_3_0',
                method: 'approveProposal',
                motionIndex: 2,
                ayes: [],
                nays: [],
                threshold: 2,
                motionEnd: { endBlock: 1, remainingBlocks: 1, timeLeft: { seconds: 6 } },
            })
        })
    })
})
