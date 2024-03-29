import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { SessionData } from '../auth/session/session.decorator'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS } from '../utils/spec.helpers'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { IdeaNetworkDto } from './dto/idea-network.dto'
import { IdeaNetworkStatus } from './entities/idea-network-status'
import { IdeaNetworkEntity } from './entities/idea-network.entity'
import { IdeaMilestonesService } from './idea-milestones/idea-milestones.service'
import { IdeasService } from './ideas.service'
import { DefaultIdeaStatus, IdeaStatus } from './entities/idea-status'
import { createSessionData } from './spec.helpers'
import { IdeaMilestoneNetworkStatus } from './idea-milestones/entities/idea-milestone-network-status'
import { IdeaProposalDetailsEntity } from '../idea-proposal-details/idea-proposal-details.entity'
import { IdeaMilestonesRepository } from './idea-milestones/idea-milestones.repository'
import { NetworkPlanckValue } from '../utils/types'

describe(`IdeasService`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeasService)
    const getIdeaNetworkRepository = () => app.get().get(getRepositoryToken(IdeaNetworkEntity))
    const getIdeaProposalDetailsRepository = () => app.get().get(getRepositoryToken(IdeaProposalDetailsEntity))
    const getMilestoneRepository = () => app.get().get(IdeaMilestonesRepository)
    const getMilestonesService = () => app.get().get(IdeaMilestonesService)

    let sessionData: SessionData
    let otherSessionData: SessionData

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionData = await createSessionData()
        otherSessionData = await createSessionData({ username: 'other', email: 'other@example.com' })
    })
    describe('find', () => {
        it('should return ideas', async (done) => {
            await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )
            await getService().create(
                {
                    details: { title: 'Test title 2' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.TurnedIntoProposal,
                },
                sessionData,
            )

            const ideas = await getService().find()

            expect(ideas.length).toBe(2)
            done()
        })
        it('should return polkadot ideas', async (done) => {
            await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )
            await getService().create(
                {
                    details: { title: 'Test title 2' },
                    networks: [{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )
            await getService().create(
                {
                    details: { title: 'Test title 2' },
                    networks: [{ name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )

            const ideas = await getService().find(NETWORKS.POLKADOT)

            expect(ideas.length).toBe(2)
            done()
        })
        it('should return own draft ideas', async (done) => {
            await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                sessionData,
            )

            const ideas = await getService().find(undefined, sessionData)

            expect(ideas.length).toBe(1)
            done()
        })
        it('should not return other draft ideas', async (done) => {
            await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                otherSessionData,
            )

            const ideas = await getService().find(undefined, sessionData)

            expect(ideas.length).toBe(0)
            done()
        })
        it('should not return draft ideas with no user', async (done) => {
            await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                otherSessionData,
            )

            const ideas = await getService().find(undefined)

            expect(ideas.length).toBe(0)
            done()
        })
    })

    describe('findByProposalIds', () => {
        it('should return ideas for given proposalIds and network', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                },
                sessionData,
            )
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([0], NETWORKS.KUSAMA)

            expect(result.size).toBe(1)
            expect(result.get(0)?.id).toBe(idea.id)
            expect(result.get(0)?.details.title).toBe('Test title 1')
            done()
        })

        it('should not return ideas for other network', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'other_network', value: '10' as NetworkPlanckValue }],
                },
                sessionData,
            )
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([0], NETWORKS.KUSAMA)

            expect(result.size).toBe(0)
            done()
        })

        it('should not return ideas for other proposalIds', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                },
                sessionData,
            )
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([1], NETWORKS.KUSAMA)

            expect(result.size).toBe(0)
            done()
        })
    })

    describe('find one', () => {
        it('should return an existing idea', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title', content: 'content' },
                    networks: [
                        { name: NETWORKS.KUSAMA, value: '15' as NetworkPlanckValue },
                        { name: NETWORKS.POLKADOT, value: '14' as NetworkPlanckValue },
                    ],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionData,
            )

            const { entity: savedIdea } = (await getService().findOne(idea.id, sessionData))!

            expect(savedIdea.details.title).toBe('Test title')
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.details.content).toBe('content')
            expect(savedIdea.networks).toBeDefined()
            expect(savedIdea.networks!.length).toBe(2)
            expect(savedIdea.networks!.find((n: IdeaNetworkEntity) => n.name === NETWORKS.KUSAMA)).toBeDefined()
            expect(savedIdea.networks!.find((n: IdeaNetworkEntity) => n.name === NETWORKS.POLKADOT)).toBeDefined()
            expect(savedIdea.ordinalNumber).toBeDefined()
            done()
        })

        it('should return not found for not existing idea', async (done) => {
            await expect(getService().findOne(uuid())).rejects.toThrow(NotFoundException)
            done()
        })
        it('should return own draft idea', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                sessionData,
            )

            const savedIdea = await getService().findOne(idea.id, sessionData)

            expect(savedIdea).toBeDefined()
            done()
        })
        it('should not return other draft idea', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                otherSessionData,
            )

            await expect(getService().findOne(idea.id, sessionData)).rejects.toThrow(NotFoundException)
            done()
        })
        it('should not return draft idea with no user', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                otherSessionData,
            )

            await expect(getService().findOne(idea.id)).rejects.toThrow(NotFoundException)
            done()
        })
    })
    describe('findIdeasByUserId', () => {
        const setUpIdea = (title: string, status: IdeaStatus, networkName: string, userSessionData: SessionData) =>
            getService().create(
                {
                    details: { title },
                    networks: [{ name: networkName, value: '10' as NetworkPlanckValue }],
                    status,
                },
                userSessionData,
            )

        it('should return only ideas owned by the user', async () => {
            const [expected] = await Promise.all([
                setUpIdea('active polkadot user 1', IdeaStatus.Active, NETWORKS.POLKADOT, sessionData),
                setUpIdea('active polkadot user 2', IdeaStatus.Active, NETWORKS.POLKADOT, otherSessionData),
            ])

            const ideas = await getService().findIdeasByUserId(NETWORKS.POLKADOT, sessionData.user.id)

            expect(Array.isArray(ideas)).toBe(true)
            expect(ideas).toHaveLength(1)
            expect(ideas[0].entity.id).toBe(expected.entity.id)
        })

        it('should return only ideas in the given network', async () => {
            const [expected] = await Promise.all([
                setUpIdea('active polkadot user 1', IdeaStatus.Active, NETWORKS.POLKADOT, sessionData),
                setUpIdea('active kusama user 1', IdeaStatus.Active, NETWORKS.KUSAMA, sessionData),
            ])

            const ideas = await getService().findIdeasByUserId(NETWORKS.POLKADOT, sessionData.user.id)

            expect(Array.isArray(ideas)).toBe(true)
            expect(ideas).toHaveLength(1)
            expect(ideas[0].entity.id).toBe(expected.entity.id)
        })

        it('should return only idea when idea published in multiple network', async () => {
            const [expected] = await Promise.all([
                getService().create(
                    {
                        details: { title: 'idea title' },
                        networks: [
                            { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue },
                            { name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue },
                        ],
                        status: IdeaStatus.Active,
                    },
                    sessionData,
                ),
            ])

            const ideas = await getService().findIdeasByUserId(NETWORKS.POLKADOT, sessionData.user.id)

            expect(Array.isArray(ideas)).toBe(true)
            expect(ideas).toHaveLength(1)
            expect(ideas[0].entity.id).toBe(expected.entity.id)
        })
    })
    describe('create', () => {
        it('should create and save idea with owner', async () => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.ownerId).toBe(sessionData.user.id)
        })

        it('should create and save idea with default idea status', async () => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.status).toBe(DefaultIdeaStatus)
        })

        it('should create and save idea with draft status', async () => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                    status: IdeaStatus.Draft,
                } as CreateIdeaDto,
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.status).toBe(IdeaStatus.Draft)
        })

        it('should create and save idea with active status', async () => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                    status: IdeaStatus.Active,
                } as CreateIdeaDto,
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.status).toBe(IdeaStatus.Active)
        })

        it('should add auto generated ordinal number', async () => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.ordinalNumber).toBeDefined()
        })

        it('should auto increment ordinal number', async () => {
            const { entity: createdFirstIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const { entity: createdSecondIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '1' as NetworkPlanckValue } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            expect(createdSecondIdea.ordinalNumber).toBe(createdFirstIdea.ordinalNumber + 1)
        })

        it('should create and save idea with all valid data', async (done) => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: {
                        title: 'Test title',
                        content: 'Test content',
                        field: 'Test field',
                        contact: 'Test contact',
                        portfolio: 'Test portfolio',
                        links: ['https://goodlink.com'],
                    },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.details.title).toBe('Test title')
            expect(savedIdea.details.content).toBe('Test content')
            expect(savedIdea.details.field).toBe('Test field')
            expect(savedIdea.details.contact).toBe('Test contact')
            expect(savedIdea.details.portfolio).toBe('Test portfolio')
            expect(savedIdea.details.links).toEqual(JSON.stringify(['https://goodlink.com']))
            done()
        })

        it('should create and save idea with networks', async (done) => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                },
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.details.title).toBe('Test title')
            expect(savedIdea.networks!.length).toBe(1)
            expect(savedIdea.networks![0].name).toBe(NETWORKS.KUSAMA)
            expect(savedIdea.networks![0].value).toBe('10')
            expect(savedIdea.networks![0].status).toBe(IdeaNetworkStatus.Active)
            done()
        })
    })

    describe('update', () => {
        it('should update and save idea with updated networks', async () => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                },
                sessionData,
            )
            await getService().update(
                {
                    networks: [{ ...idea.networks[0], value: '249' as NetworkPlanckValue }],
                },
                idea.id,
                sessionData,
            )
            const { entity: savedIdea } = await getService().findOne(idea.id, sessionData)
            expect(savedIdea.networks[0].name).toBe(NETWORKS.KUSAMA)
            expect(savedIdea.networks[0].value).toBe('249')
            expect(savedIdea.networks![0].status).toBe(IdeaNetworkStatus.Active)
        })

        it('should update and save idea milestone networks when updating networks', async () => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                },
                sessionData,
            )
            const ideaMilestone = await getMilestonesService().create(
                idea.id,
                {
                    networks: [
                        {
                            name: NETWORKS.KUSAMA,
                            value: '20' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    ],
                    beneficiary: null,
                    details: { subject: 'subject' },
                },
                sessionData,
            )

            await getService().update(
                {
                    networks: [idea.networks[0], { name: NETWORKS.POLKADOT, value: '10' as NetworkPlanckValue }],
                },
                idea.id,
                sessionData,
            )

            const actualMilestone = await getMilestonesService().findOne(ideaMilestone.id, sessionData)
            expect(actualMilestone.networks.length).toBe(2)

            const kusamaMilestoneNetwork = actualMilestone.networks.find((n) => n.name === NETWORKS.KUSAMA)!
            expect(kusamaMilestoneNetwork).toBeDefined()
            expect(kusamaMilestoneNetwork.value).toBe('20')

            const polkadotMilestoneNetwork = actualMilestone.networks.find((n) => n.name === NETWORKS.POLKADOT)!
            expect(polkadotMilestoneNetwork).toBeDefined()
            expect(polkadotMilestoneNetwork.value).toBe('0')
        })

        it('should throw not found if wrong id', async (done) => {
            await expect(getService().update({}, uuid(), sessionData)).rejects.toThrow(NotFoundException)
            done()
        })

        it('should update and save idea with updated status', async () => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                },
                sessionData,
            )
            await getService().update({ status: IdeaStatus.Active }, idea.id, sessionData)
            const { entity: savedIdea } = await getService().findOne(idea.id, sessionData)
            expect(savedIdea.status).toBe(IdeaStatus.Active)
        })

        it('should throw forbidden exception when trying to update not own idea', async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )

            const otherUser = await createSessionData({ username: 'otherUser', email: 'other@email.com' })

            await expect(getService().update({ status: IdeaStatus.Active }, idea.id, otherUser)).rejects.toThrow(
                ForbiddenException,
            )
            done()
        })

        it(`should throw BadRequestException when trying to update idea with ${IdeaStatus.TurnedIntoProposal} status`, async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                    status: IdeaStatus.TurnedIntoProposal,
                },
                sessionData,
            )

            await expect(
                getService().update({ details: { title: 'New title' } }, idea.id, sessionData),
            ).rejects.toThrow(BadRequestException)
            done()
        })

        it(`should throw BadRequestException when trying to update idea with ${IdeaStatus.MilestoneSubmission} status`, async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                    status: IdeaStatus.MilestoneSubmission,
                },
                sessionData,
            )

            await expect(
                getService().update({ details: { title: 'New title' } }, idea.id, sessionData),
            ).rejects.toThrow(BadRequestException)
            done()
        })
    })

    describe('delete', () => {
        it('should delete idea', async (done) => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '42' as NetworkPlanckValue }],
                },
                sessionData,
            )
            await getService().delete(createdIdea.id, sessionData)
            await expect(getService().findOne(createdIdea.id, sessionData)).rejects.toThrow(NotFoundException)
            done()
        })
        it('should return not found if wrong id', async (done) => {
            await expect(getService().findOne(uuid())).rejects.toThrow(NotFoundException)
            done()
        })
        it('should throw forbidden exception when trying to delete not own idea', async (done) => {
            const { entity: createdIdea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '42' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )

            const otherUser = await createSessionData({ username: 'otherUser', email: 'other@email.com' })

            await expect(getService().delete(createdIdea.id, otherUser)).rejects.toThrow(ForbiddenException)
            done()
        })

        it(`should throw BadRequestException exception when trying to delete idea with ${IdeaStatus.TurnedIntoProposal} status`, async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                    status: IdeaStatus.TurnedIntoProposal,
                },
                sessionData,
            )

            await expect(getService().delete(idea.id, sessionData)).rejects.toThrow(BadRequestException)
            done()
        })

        it(`should throw BadRequestException exception when trying to delete idea with ${IdeaStatus.TurnedIntoProposal} status`, async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                    status: IdeaStatus.TurnedIntoProposal,
                },
                sessionData,
            )

            await expect(getService().delete(idea.id, sessionData)).rejects.toThrow(BadRequestException)
            done()
        })
        it(`should throw BadRequestException exception when trying to delete idea with ${IdeaStatus.MilestoneSubmission} status`, async (done) => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '44' as NetworkPlanckValue }],
                    status: IdeaStatus.MilestoneSubmission,
                },
                sessionData,
            )
            await expect(getService().delete(idea.id, sessionData)).rejects.toThrow(BadRequestException)
            done()
        })
        it('should delete milestone, networks and ideas when delete idea', async () => {
            const { entity: idea } = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '42' as NetworkPlanckValue }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )

            const ideaMilestone = await getMilestonesService().create(
                idea.id,
                {
                    networks: [
                        {
                            name: NETWORKS.KUSAMA,
                            value: '42' as NetworkPlanckValue,
                            status: IdeaMilestoneNetworkStatus.Active,
                        },
                    ],
                    beneficiary: null,
                    details: { subject: 'subject' },
                },
                sessionData,
            )

            await getService().delete(idea.id, sessionData)

            const network = await getIdeaNetworkRepository().findOne(idea.networks[0].id)
            expect(network).toBeUndefined()

            const details = await getIdeaProposalDetailsRepository().findOne(idea.details.id)
            expect(details).toBeUndefined()

            const milestone = await getMilestoneRepository().findOne(ideaMilestone.id)
            expect(milestone).toBeUndefined()
        })
    })
})
