import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { IdeaProposalDetails } from '../../idea-proposal-details/idea-proposal-details.entity'
import { createSessionData } from '../../ideas/spec.helpers'
import { Web3Address } from '../../users/web3-addresses/web3-address.entity'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { ProposalStatus } from '../dto/proposal.dto'
import { mockedBlockchainService, setUpProposalFromIdea } from '../spec.helpers'
import { ProposalMilestone } from './entities/proposal-milestone.entity'
import { ProposalMilestonesService } from './proposal-milestones.service'
import { createProposalMilestone, setUp } from './spec.helpers'

describe(`ProposalMilestonesService`, () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<ProposalMilestonesService>(ProposalMilestonesService))
    const repository = beforeAllSetup(() =>
        app().get<Repository<ProposalMilestone>>(getRepositoryToken(ProposalMilestone)),
    )
    const detailsRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaProposalDetails>>(getRepositoryToken(IdeaProposalDetails)),
    )

    beforeAll(() => {
        jest.spyOn(app().get(BlockchainService), 'getProposals').mockImplementation(
            mockedBlockchainService.getProposals,
        )
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('find', () => {
        it('should return proposal milestones', async () => {
            const { proposal } = await setUp(app())
            const milestone1 = await createProposalMilestone(
                app(),
                proposal,
                {},
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )
            const milestone2 = await createProposalMilestone(app(), proposal, {})

            const milestones = await service().find(proposal.blockchainProposalId, NETWORKS.POLKADOT)

            expect(milestones.length).toBe(2)

            const actualMilestone1 = milestones.find((m) => m.id === milestone1.id)
            expect(actualMilestone1).toBeDefined()
            expect(actualMilestone1!.details.subject).toBe('subject')
            expect(actualMilestone1!.details.dateFrom).toBe('2021-04-20')
            expect(actualMilestone1!.details.dateTo).toBe('2021-04-21')
            expect(actualMilestone1!.details.description).toBe('description')

            const actualMilestone2 = milestones.find((m) => m.id === milestone2.id)
            expect(actualMilestone2).toBeDefined()
        })

        it('should return empty array for proposal with no entity assigned', async () => {
            const milestones = await service().find(1, NETWORKS.POLKADOT)
            expect(milestones.length).toBe(0)
        })

        it('should return empty array for proposal entity assigned and no milestones', async () => {
            const { proposal } = await setUp(app())
            const milestones = await service().find(proposal.blockchainProposalId, NETWORKS.POLKADOT)
            expect(milestones.length).toBe(0)
        })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(service().find(100, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })

        it('should throw not found exception for proposal from another network', async () => {
            await expect(service().find(0, NETWORKS.KUSAMA)).rejects.toThrow(NotFoundException)
        })
    })

    describe('findOne', () => {
        it('should return proposal milestone', async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(
                app(),
                proposal,
                {},
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )

            const actualMilestone = await service().findOne(
                milestone.id,
                proposal.blockchainProposalId,
                NETWORKS.POLKADOT,
            )

            expect(actualMilestone).toBeDefined()
            expect(actualMilestone.details.subject).toBe('subject')
            expect(actualMilestone.details.dateFrom).toBe('2021-04-20')
            expect(actualMilestone.details.dateTo).toBe('2021-04-21')
            expect(actualMilestone.details.description).toBe('description')
        })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(service().findOne(uuid(), 100, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })

        it('should throw not found exception for not existing proposal milestone', async () => {
            await expect(service().findOne(uuid(), 0, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })

        it('should throw not found exception for wrong network', async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            await expect(
                service().findOne(milestone.id, proposal.blockchainProposalId, NETWORKS.KUSAMA),
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw not found exception for a proposal milestone from another proposal', async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal, {})
            await expect(service().findOne(milestone.id, 1, NETWORKS.POLKADOT)).rejects.toThrow(NotFoundException)
        })
    })

    describe('create', () => {
        const details = { subject: 'Subject' }

        it('should save the proposal milestone and details', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())

            await service().create(
                proposal.blockchainProposalId,
                NETWORKS.POLKADOT,
                {
                    details: {
                        subject: 'Subject',
                        description: 'Description',
                        dateFrom: new Date('2021-04-20'),
                        dateTo: new Date('2021-04-21'),
                    },
                },
                sessionData,
            )

            const savedMilestone = (await repository().findOne({ proposalId: proposal.id }))!

            expect(savedMilestone.details.subject).toBe('Subject')
            expect(savedMilestone.details.dateFrom).toBe('2021-04-20')
            expect(savedMilestone.details.dateTo).toBe('2021-04-21')
            expect(savedMilestone.details.description).toBe('Description')
        })

        it('should return the proposal milestone with details', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())

            const actualMilestone = await service().create(
                proposal.blockchainProposalId,
                NETWORKS.POLKADOT,
                {
                    details: {
                        subject: 'Subject',
                        description: 'Description',
                        dateFrom: new Date('2021-04-20'),
                        dateTo: new Date('2021-04-21'),
                    },
                },
                sessionData,
            )

            expect(actualMilestone).toBeDefined()
            expect(actualMilestone.details.subject).toBe('Subject')
            expect(actualMilestone.details.dateFrom).toBe('2021-04-20')
            expect(actualMilestone.details.dateTo).toBe('2021-04-21')
            expect(actualMilestone.details.description).toBe('Description')
        })

        it('should throw not found exception for not existing proposal', async () => {
            const {
                sessionHandler: { sessionData },
            } = await setUp(app())
            await expect(service().create(100, NETWORKS.POLKADOT, { details }, sessionData)).rejects.toThrow(
                NotFoundException,
            )
        })

        it(`should throw BadRequestException for a proposal with status other than ${ProposalStatus.Submitted}`, async () => {
            const {
                sessionHandler: { sessionData },
            } = await setUp(app(), { blockchainProposalId: 3 })
            await expect(service().create(3, NETWORKS.POLKADOT, { details }, sessionData)).rejects.toThrow(
                BadRequestException,
            )
        })

        it(`should throw BadRequestException for a proposal with with no details created`, async () => {
            const {
                sessionHandler: { sessionData },
            } = await setUp(app())
            await expect(service().create(2, NETWORKS.POLKADOT, { details }, sessionData)).rejects.toThrow(
                BadRequestException,
            )
        })

        it(`should throw ForbiddenException for a proposal with other owner`, async () => {
            const { proposal } = await setUp(app())
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })
            await expect(
                service().create(proposal.blockchainProposalId, NETWORKS.POLKADOT, { details }, otherSessionData),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should resolve when user with proposer address assigned tries to update`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())
            const proposerSessionData = await createSessionData({
                username: 'other',
                email: 'other@example.con',
                web3Addresses: [new Web3Address('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', true)],
            })

            await expect(
                service().create(
                    proposal.blockchainProposalId,
                    proposal.networkId,
                    {
                        details,
                    },
                    proposerSessionData,
                ),
            ).resolves.toBeDefined()
        })
    })

    describe('update', () => {
        it('should save the proposal milestone and details', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            await service().update(
                milestone.id,
                proposal.blockchainProposalId,
                NETWORKS.POLKADOT,
                {
                    details: {
                        subject: 'Subject',
                        description: 'Description',
                        dateFrom: new Date('2021-04-20'),
                        dateTo: new Date('2021-04-21'),
                    },
                },
                sessionData,
            )

            const savedMilestone = (await repository().findOne(milestone.id))!

            expect(savedMilestone.details.subject).toBe('Subject')
            expect(savedMilestone.details.dateFrom).toBe('2021-04-20')
            expect(savedMilestone.details.dateTo).toBe('2021-04-21')
            expect(savedMilestone.details.description).toBe('Description')
        })

        it('should return the proposal milestone with details', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())

            const milestone = await createProposalMilestone(app(), proposal)

            const actualMilestone = await service().update(
                milestone.id,
                proposal.blockchainProposalId,
                NETWORKS.POLKADOT,
                {
                    details: {
                        subject: 'Subject',
                        description: 'Description',
                        dateFrom: new Date('2021-04-20'),
                        dateTo: new Date('2021-04-21'),
                    },
                },
                sessionData,
            )

            expect(actualMilestone).toBeDefined()
            expect(actualMilestone.details.subject).toBe('Subject')
            expect(actualMilestone.details.dateFrom).toBe('2021-04-20')
            expect(actualMilestone.details.dateTo).toBe('2021-04-21')
            expect(actualMilestone.details.description).toBe('Description')
        })

        it('should update only the given properties', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())
            const milestone = await createProposalMilestone(
                app(),
                proposal,
                {},
                {
                    subject: 'Subject',
                    description: 'Description',
                    dateFrom: new Date('2021-04-20'),
                    dateTo: new Date('2021-04-21'),
                },
            )

            await service().update(
                milestone.id,
                proposal.blockchainProposalId,
                NETWORKS.POLKADOT,
                {
                    details: {
                        subject: 'New subject',
                    },
                },
                sessionData,
            )

            const savedMilestone = (await repository().findOne(milestone.id))!

            expect(savedMilestone.details.subject).toBe('New subject')
            expect(savedMilestone.details.dateFrom).toBe('2021-04-20')
            expect(savedMilestone.details.dateTo).toBe('2021-04-21')
            expect(savedMilestone.details.description).toBe('Description')
        })

        it('should throw not found exception for not existing proposal', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            await expect(service().update(milestone.id, 100, NETWORKS.POLKADOT, {}, sessionData)).rejects.toThrow(
                NotFoundException,
            )
        })

        it('should throw NotFoundException for not existing milestone', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())

            await expect(
                service().update(uuid(), proposal.blockchainProposalId, NETWORKS.POLKADOT, {}, sessionData),
            ).rejects.toThrow(NotFoundException)
        })

        it(`should throw BadRequestException for a proposal with status other than ${ProposalStatus.Submitted}`, async () => {
            const {
                sessionHandler: { sessionData },
                proposal,
            } = await setUp(app(), { blockchainProposalId: 3 })
            const milestone = await createProposalMilestone(app(), proposal)

            await expect(service().update(milestone.id, 3, NETWORKS.POLKADOT, {}, sessionData)).rejects.toThrow(
                BadRequestException,
            )
        })

        it(`should throw ForbiddenException for a proposal with other owner`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })
            await expect(
                service().update(milestone.id, proposal.blockchainProposalId, NETWORKS.POLKADOT, {}, otherSessionData),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should resolve when user with proposer address assigned tries to update`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())
            const milestone = await createProposalMilestone(app(), proposal)
            const proposerSessionData = await createSessionData({
                username: 'other',
                email: 'other@example.con',
                web3Addresses: [new Web3Address('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', true)],
            })

            await expect(
                service().update(
                    milestone.id,
                    proposal.blockchainProposalId,
                    proposal.networkId,
                    {},
                    proposerSessionData,
                ),
            ).resolves.toBeDefined()
        })
    })

    describe('delete', () => {
        it('should remove the proposal milestone and details', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            await service().delete(milestone.id, proposal.blockchainProposalId, NETWORKS.POLKADOT, sessionData)

            const deletedMilestone = await repository().findOne(milestone.id)
            const deletedMilestoneDetails = await detailsRepository().findOne(milestone.details.id)

            expect(deletedMilestone).toBeUndefined()
            expect(deletedMilestoneDetails).toBeUndefined()
        })

        it('should throw not found exception for not existing proposal', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)

            await expect(service().delete(milestone.id, 100, NETWORKS.POLKADOT, sessionData)).rejects.toThrow(
                NotFoundException,
            )
        })

        it('should throw NotFoundException for not existing milestone', async () => {
            const {
                proposal,
                sessionHandler: { sessionData },
            } = await setUp(app())

            await expect(
                service().delete(uuid(), proposal.blockchainProposalId, NETWORKS.POLKADOT, sessionData),
            ).rejects.toThrow(NotFoundException)
        })

        it(`should throw BadRequestException for a proposal with status other than ${ProposalStatus.Submitted}`, async () => {
            const {
                sessionHandler: { sessionData },
                proposal,
            } = await setUp(app(), { blockchainProposalId: 3 })
            const milestone = await createProposalMilestone(app(), proposal)

            await expect(service().delete(milestone.id, 3, NETWORKS.POLKADOT, sessionData)).rejects.toThrow(
                BadRequestException,
            )
        })

        it(`should throw ForbiddenException for a proposal with other owner`, async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal)
            const otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })
            await expect(
                service().delete(milestone.id, proposal.blockchainProposalId, NETWORKS.POLKADOT, otherSessionData),
            ).rejects.toThrow(ForbiddenException)
        })

        it(`should resolve when user with proposer address assigned tries to delete`, async () => {
            const { proposal } = await setUpProposalFromIdea(app())
            const milestone = await createProposalMilestone(app(), proposal)
            const proposerSessionData = await createSessionData({
                username: 'other',
                email: 'other@example.con',
                web3Addresses: [new Web3Address('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', true)],
            })

            await expect(
                service().delete(milestone.id, proposal.blockchainProposalId, proposal.networkId, proposerSessionData),
            ).resolves.toBeUndefined()
        })
    })
})
