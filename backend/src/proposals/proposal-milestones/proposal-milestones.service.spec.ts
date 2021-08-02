import { NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { BlockchainService } from '../../blockchain/blockchain.service'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { mockedBlockchainService } from '../spec.helpers'
import { ProposalMilestonesService } from './proposal-milestones.service'
import { createProposalMilestone, setUp } from './spec.helpers'

describe(`IdeaMilestonesService`, () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<ProposalMilestonesService>(ProposalMilestonesService))

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
                {
                    ordinalNumber: 1,
                },
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )
            const milestone2 = await createProposalMilestone(app(), proposal, {
                ordinalNumber: 2,
            })

            const milestones = await service().find(proposal.blockchainProposalId, NETWORKS.POLKADOT)

            expect(milestones.length).toBe(2)

            const actualMilestone1 = milestones.find((m) => m.id === milestone1.id)
            expect(actualMilestone1).toBeDefined()
            expect(actualMilestone1!.ordinalNumber).toBe(1)
            expect(actualMilestone1!.details.subject).toBe('subject')
            expect(actualMilestone1!.details.dateFrom).toBe('2021-04-20')
            expect(actualMilestone1!.details.dateTo).toBe('2021-04-21')
            expect(actualMilestone1!.details.description).toBe('description')

            const actualMilestone2 = milestones.find((m) => m.id === milestone2.id)
            expect(actualMilestone2).toBeDefined()
            expect(actualMilestone2!.ordinalNumber).toBe(2)
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
                {
                    ordinalNumber: 1,
                },
                {
                    subject: 'subject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'description',
                },
            )

            const actualMilestone = await service().findOne(milestone.id, proposal.blockchainProposalId)

            expect(actualMilestone).toBeDefined()
            expect(actualMilestone.ordinalNumber).toBe(1)
            expect(actualMilestone.details.subject).toBe('subject')
            expect(actualMilestone.details.dateFrom).toBe('2021-04-20')
            expect(actualMilestone.details.dateTo).toBe('2021-04-21')
            expect(actualMilestone.details.description).toBe('description')
        })

        it('should throw not found exception for not existing proposal', async () => {
            await expect(service().findOne(uuid(), 100)).rejects.toThrow(NotFoundException)
        })

        it('should throw not found exception for not existing proposal milestone', async () => {
            await expect(service().findOne(uuid(), 0)).rejects.toThrow(NotFoundException)
        })

        it('should throw not found exception for a proposal milestone from another proposal', async () => {
            const { proposal } = await setUp(app())
            const milestone = await createProposalMilestone(app(), proposal, {
                ordinalNumber: 1,
            })
            await expect(service().findOne(milestone.id, 1)).rejects.toThrow(NotFoundException)
        })
    })
})
