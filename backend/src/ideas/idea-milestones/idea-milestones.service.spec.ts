import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { SessionData } from '../../auth/session/session.decorator'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS } from '../../utils/spec.helpers'
import { Idea } from '../entities/idea.entity'
import { IdeaStatus } from '../entities/idea-status'
import { IdeasService } from '../ideas.service'
import { createIdea, createSessionData } from '../spec.helpers'
import { CreateIdeaMilestoneDto } from './dto/create-idea-milestone.dto'
import { IdeaMilestoneNetwork } from './entities/idea-milestone-network.entity'
import { IdeaMilestonesService } from './idea-milestones.service'

const minimalCreateIdeaMilestoneDto = {
    details: { subject: 'ideaMilestoneSubject' },
    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
}

describe(`IdeaMilestonesService`, () => {
    const app = beforeSetupFullApp()

    const getIdeasService = () => app.get().get(IdeasService)
    const getIdeaMilestonesService = () => app.get().get(IdeaMilestonesService)

    const ideaMilestoneNetworkRepository = beforeAllSetup(() =>
        app().get<Repository<IdeaMilestoneNetwork>>(getRepositoryToken(IdeaMilestoneNetwork)),
    )

    let idea: Idea

    let sessionData: SessionData
    let otherSessionData: SessionData

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionData = await createSessionData()
        otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })

        idea = await createIdea({ networks: [{ name: NETWORKS.POLKADOT, value: 100 }] }, sessionData, getIdeasService())
    })

    describe('find', () => {
        it('should throw not found exception for not existing idea', async () => {
            await expect(getIdeaMilestonesService().find(uuid(), sessionData)).rejects.toThrow(NotFoundException)
        })

        it('should return empty array for idea without milestones', async () => {
            const ideaMilestones = await getIdeaMilestonesService().find(idea.id, sessionData)
            expect(ideaMilestones.length).toBe(0)
        })

        it('should return idea milestones for idea with added milestones', async () => {
            const createIdeaMilestoneDto: CreateIdeaMilestoneDto = {
                details: { subject: 'ideaMilestoneSubject' },
                networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
            }

            await getIdeaMilestonesService().create(idea.id, createIdeaMilestoneDto, sessionData)
            await getIdeaMilestonesService().create(idea.id, createIdeaMilestoneDto, sessionData)

            const ideaMilestones = await getIdeaMilestonesService().find(idea.id, sessionData)

            expect(ideaMilestones.length).toBe(2)
        })

        it('should return idea milestones only for the given idea', async () => {
            const anotherIdea = await createIdea({ networks: [{ name: NETWORKS.POLKADOT, value: 100 }] }, sessionData)

            await getIdeaMilestonesService().create(
                idea.id,
                {
                    details: { subject: 'ideaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )
            await getIdeaMilestonesService().create(
                anotherIdea.id,
                {
                    details: { subject: 'ideaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )

            const ideaMilestones = await getIdeaMilestonesService().find(idea.id, sessionData)

            expect(ideaMilestones.length).toBe(1)
            expect(ideaMilestones[0].details.subject).toBe('ideaMilestoneSubject1')
        })

        it('should return idea milestones for draft idea for owner', async () => {
            const draftIdea = await createIdea(
                { networks: [{ name: NETWORKS.POLKADOT, value: 100 }], status: IdeaStatus.Draft },
                sessionData,
            )
            await getIdeaMilestonesService().create(
                draftIdea.id,
                {
                    details: { subject: 'draftIdeaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )
            const result = await getIdeaMilestonesService().find(draftIdea.id, sessionData)
            expect(result.length).toBe(1)
            expect(result[0].details.subject).toBe('draftIdeaMilestoneSubject1')
        })

        it('should throw not found for draft idea for not owner', async () => {
            const draftIdea = await createIdea(
                { networks: [{ name: NETWORKS.POLKADOT, value: 100 }], status: IdeaStatus.Draft },
                sessionData,
            )

            await expect(getIdeaMilestonesService().findOne(draftIdea.id, otherSessionData)).rejects.toThrow(
                NotFoundException,
            )
        })
    })

    describe('findOne', () => {
        it('should throw not found exception for not existing idea milestone', async () => {
            await expect(getIdeaMilestonesService().findOne(uuid(), sessionData)).rejects.toThrow(NotFoundException)
        })

        it('should return existing idea milestone', async () => {
            const createIdeaMilestoneDto = {
                details: {
                    subject: 'ideaMilestoneSubject',
                    dateFrom: new Date(2021, 3, 20),
                    dateTo: new Date(2021, 3, 21),
                    description: 'ideaMilestoneDescription',
                },
                networks: [
                    { name: NETWORKS.POLKADOT, value: 50 },
                    { name: NETWORKS.KUSAMA, value: 100 },
                ],
                beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
            }

            const createdIdeaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                createIdeaMilestoneDto,
                sessionData,
            )

            const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionData)

            expect(foundIdeaMilestone.details.subject).toBe('ideaMilestoneSubject')
            expect(foundIdeaMilestone.networks).toBeDefined()
            expect(foundIdeaMilestone.networks.length).toBe(2)
            expect(
                foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === NETWORKS.KUSAMA),
            ).toBeDefined()
            expect(
                foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === NETWORKS.POLKADOT),
            ).toBeDefined()
            expect(foundIdeaMilestone.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(foundIdeaMilestone.details.dateFrom).toBe('2021-04-20')
            expect(foundIdeaMilestone.details.dateTo).toBe('2021-04-21')
            expect(foundIdeaMilestone.details.description).toBe('ideaMilestoneDescription')
            expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
        })

        it('should return idea milestone for draft idea for owner', async () => {
            const draftIdea = await createIdea(
                { networks: [{ name: NETWORKS.POLKADOT, value: 100 }], status: IdeaStatus.Draft },
                sessionData,
            )
            const milestone = await getIdeaMilestonesService().create(
                draftIdea.id,
                {
                    details: { subject: 'draftIdeaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )
            const result = await getIdeaMilestonesService().findOne(milestone.id, sessionData)
            expect(result).toBeDefined()
            expect(result.details.subject).toBe('draftIdeaMilestoneSubject1')
        })

        it('should throw not found for draft idea for not owner', async () => {
            const draftIdea = await createIdea(
                {
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                    status: IdeaStatus.Draft,
                },
                sessionData,
            )

            await expect(getIdeaMilestonesService().findOne(draftIdea.id, otherSessionData)).rejects.toThrow(
                NotFoundException,
            )
        })
    })

    describe('findByProposalIds', () => {
        it('should return idea milestones for given proposal ids and network name', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                {
                    details: { subject: 'draftIdeaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )

            ideaMilestone.networks[0].blockchainProposalId = 0
            await ideaMilestoneNetworkRepository().save(ideaMilestone.networks[0])

            const result = await getIdeaMilestonesService().findByProposalIds([0], NETWORKS.POLKADOT)

            expect(result.size).toBe(1)
            expect(result.get(0)?.id).toBe(ideaMilestone.id)
            expect(result.get(0)?.idea.id).toBe(idea.id)
        })

        it('should not return idea milestones for other network name', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                {
                    details: { subject: 'draftIdeaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )

            ideaMilestone.networks[0].blockchainProposalId = 0
            await ideaMilestoneNetworkRepository().save(ideaMilestone.networks[0])

            const result = await getIdeaMilestonesService().findByProposalIds([0], NETWORKS.KUSAMA)

            expect(result.size).toBe(0)
        })

        it('should not return idea milestones for other proposal ids', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                {
                    details: { subject: 'draftIdeaMilestoneSubject1' },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                },
                sessionData,
            )

            ideaMilestone.networks[0].blockchainProposalId = 0
            await ideaMilestoneNetworkRepository().save(ideaMilestone.networks[0])

            const result = await getIdeaMilestonesService().findByProposalIds([1, 2], NETWORKS.POLKADOT)

            expect(result.size).toBe(0)
        })
    })

    describe('create', () => {
        it('should create and save an idea milestone', async () => {
            const createdIdeaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                minimalCreateIdeaMilestoneDto,
                sessionData,
            )
            const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionData)

            expect(foundIdeaMilestone).toBeDefined()
        })

        it('should add positive ordinal number', async () => {
            const createdIdeaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                minimalCreateIdeaMilestoneDto,
                sessionData,
            )
            const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionData)

            expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
            expect(foundIdeaMilestone.ordinalNumber).toBeGreaterThan(0)
        })

        it('should auto increment ordinal number', async () => {
            const firstCreatedIdeaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                minimalCreateIdeaMilestoneDto,
                sessionData,
            )
            const secondCreatedIdeaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                minimalCreateIdeaMilestoneDto,
                sessionData,
            )

            expect(secondCreatedIdeaMilestone.ordinalNumber).toBe(firstCreatedIdeaMilestone.ordinalNumber + 1)
        })

        it('should create and save idea milestone with all valid data', async () => {
            const createdIdeaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                {
                    details: {
                        subject: 'ideaMilestoneSubject',
                        dateFrom: new Date(2021, 3, 20),
                        dateTo: new Date(2021, 3, 21),
                        description: 'ideaMilestoneDescription',
                    },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionData,
            )

            const foundIdeaMilestone = await getIdeaMilestonesService().findOne(createdIdeaMilestone.id, sessionData)

            expect(foundIdeaMilestone.details.subject).toBe('ideaMilestoneSubject')
            expect(foundIdeaMilestone.networks).toBeDefined()
            expect(foundIdeaMilestone.networks.length).toBe(1)
            expect(
                foundIdeaMilestone.networks.find((n: IdeaMilestoneNetwork) => n.name === NETWORKS.POLKADOT),
            ).toBeDefined()
            expect(foundIdeaMilestone.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(foundIdeaMilestone.details.dateFrom).toBe('2021-04-20')
            expect(foundIdeaMilestone.details.dateTo).toBe('2021-04-21')
            expect(foundIdeaMilestone.details.description).toBe('ideaMilestoneDescription')
            expect(foundIdeaMilestone.ordinalNumber).toBeDefined()
        })

        it('should throw forbidden for not owner', async () => {
            await expect(
                getIdeaMilestonesService().create(idea.id, minimalCreateIdeaMilestoneDto, otherSessionData),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe('update', () => {
        it('should throw not found if wrong id', async () => {
            await expect(getIdeaMilestonesService().update(uuid(), {}, sessionData)).rejects.toThrow(NotFoundException)
        })

        it('should update and save idea milestone with updated subject', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                minimalCreateIdeaMilestoneDto,
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                { details: { subject: 'Updated subject' } },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.details.subject).toBe('Updated subject')
        })

        it('should update and save idea milestone with updated subject and not change other data', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                {
                    details: {
                        subject: 'ideaMilestoneSubject',
                        dateFrom: new Date(2021, 3, 20),
                        dateTo: new Date(2021, 3, 21),
                        description: 'ideaMilestoneDescription',
                    },
                    networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                { details: { subject: 'Updated subject' } },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.details.subject).toBe('Updated subject')
            expect(updatedIdeaMilestone.networks).toBeDefined()
            expect(updatedIdeaMilestone.networks.length).toBe(1)
            expect(updatedIdeaMilestone.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(updatedIdeaMilestone.networks[0].value).toBe('100.000000000000000')
            expect(updatedIdeaMilestone.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(updatedIdeaMilestone.details.dateFrom).toBe('2021-04-20')
            expect(updatedIdeaMilestone.details.dateTo).toBe('2021-04-21')
            expect(updatedIdeaMilestone.details.description).toBe('ideaMilestoneDescription')
            expect(updatedIdeaMilestone.ordinalNumber).toBe(ideaMilestone.ordinalNumber)
        })

        it(`should update and save idea milestone with updated network's value`, async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                { ...minimalCreateIdeaMilestoneDto, networks: [{ name: NETWORKS.POLKADOT, value: 100 }] },
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                {
                    networks: [
                        {
                            ...ideaMilestone.networks[0],
                            value: 999,
                        },
                    ],
                },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.networks).toBeDefined()
            expect(updatedIdeaMilestone.networks.length).toBe(1)
            expect(updatedIdeaMilestone.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(updatedIdeaMilestone.networks[0].value).toBe(`999.000000000000000`)
        })

        it(`should update and save idea milestone with updated network's name`, async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                { ...minimalCreateIdeaMilestoneDto, networks: [{ name: NETWORKS.POLKADOT, value: 100 }] },
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                {
                    networks: [
                        {
                            ...ideaMilestone.networks[0],
                            name: NETWORKS.KUSAMA,
                        },
                    ],
                },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.networks).toBeDefined()
            expect(updatedIdeaMilestone.networks.length).toBe(1)
            expect(updatedIdeaMilestone.networks[0].name).toBe(NETWORKS.KUSAMA)
            expect(updatedIdeaMilestone.networks[0].value).toBe('100.000000000000000')
        })

        it(`should update and save idea milestone with a new network added`, async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                { ...minimalCreateIdeaMilestoneDto, networks: [{ name: NETWORKS.POLKADOT, value: 100 }] },
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                {
                    networks: [
                        ...ideaMilestone.networks,
                        {
                            name: NETWORKS.KUSAMA,
                            value: 150,
                        },
                    ],
                },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.networks).toBeDefined()
            expect(updatedIdeaMilestone.networks.length).toBe(2)

            const firstNetwork = updatedIdeaMilestone.networks.find(
                ({ name }: IdeaMilestoneNetwork) => name === NETWORKS.POLKADOT,
            )
            const secondNetwork = updatedIdeaMilestone.networks.find(
                ({ name }: IdeaMilestoneNetwork) => name === NETWORKS.KUSAMA,
            )

            expect(firstNetwork).toBeDefined()
            expect(firstNetwork!.value).toBe('100.000000000000000')

            expect(secondNetwork).toBeDefined()
            expect(secondNetwork!.value).toBe('150.000000000000000')
        })

        it(`should update and save idea milestone with one network removed`, async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                {
                    ...minimalCreateIdeaMilestoneDto,
                    networks: [
                        { name: NETWORKS.POLKADOT, value: 100 },
                        { name: NETWORKS.KUSAMA, value: 150 },
                    ],
                },
                sessionData,
            )

            const ideaMilestoneNetworkToRemain = ideaMilestone.networks.find(
                ({ name }: IdeaMilestoneNetwork) => name === NETWORKS.POLKADOT,
            )!

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                {
                    networks: [ideaMilestoneNetworkToRemain],
                },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.networks).toBeDefined()
            expect(updatedIdeaMilestone.networks.length).toBe(1)
            expect(updatedIdeaMilestone.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(updatedIdeaMilestone.networks[0].value).toBe('100.000000000000000')
        })

        it(`should update and save idea milestone with all networks removed`, async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                { ...minimalCreateIdeaMilestoneDto, networks: [{ name: NETWORKS.POLKADOT, value: 100 }] },
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                {
                    networks: [],
                },
                sessionData,
            )

            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.networks).toBeDefined()
            expect(updatedIdeaMilestone.networks.length).toBe(0)
        })

        it('should update and save idea milestone with updated beneficiary', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                { ...minimalCreateIdeaMilestoneDto, beneficiary: null },
                sessionData,
            )

            await getIdeaMilestonesService().update(
                ideaMilestone.id,
                { beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
                sessionData,
            )
            const updatedIdeaMilestone = await getIdeaMilestonesService().findOne(ideaMilestone.id, sessionData)

            expect(updatedIdeaMilestone.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
        })

        it('should throw forbidden for not owner', async () => {
            const ideaMilestone = await getIdeaMilestonesService().create(
                idea.id,
                minimalCreateIdeaMilestoneDto,
                sessionData,
            )
            await expect(
                getIdeaMilestonesService().update(
                    ideaMilestone.id,
                    { details: { description: 'Updated description' } },
                    otherSessionData,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })
})
