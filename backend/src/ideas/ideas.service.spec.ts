import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { SessionData } from '../auth/session/session.decorator'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { beforeSetupFullApp, cleanDatabase } from '../utils/spec.helpers'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { IdeaNetworkDto } from './dto/idea-network.dto'
import { IdeaNetwork } from './entities/idea-network.entity'
import { IdeasService } from './ideas.service'
import { DefaultIdeaStatus, IdeaStatus } from './idea-status'
import { createSessionData } from './spec.helpers'

describe(`IdeasService`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeasService)
    const getIdeaNetworkRepository = () => app.get().get(getRepositoryToken(IdeaNetwork))

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
                    networks: [{ name: 'kusama', value: 10 }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )
            await getService().create(
                {
                    details: { title: 'Test title 2' },
                    networks: [{ name: 'kusama', value: 10 }],
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
                    networks: [{ name: 'kusama', value: 10 }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )
            await getService().create(
                {
                    details: { title: 'Test title 2' },
                    networks: [{ name: 'polkadot', value: 10 }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )
            await getService().create(
                {
                    details: { title: 'Test title 2' },
                    networks: [{ name: 'polkadot', value: 10 }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )

            const ideas = await getService().find('polkadot')

            expect(ideas.length).toBe(2)
            done()
        })
        it('should return own draft ideas', async (done) => {
            await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'kusama', value: 10 }],
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
                    networks: [{ name: 'kusama', value: 10 }],
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
                    networks: [{ name: 'kusama', value: 10 }],
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
            const idea = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'kusama', value: 10 }],
                },
                sessionData,
            )
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([0], 'kusama')

            expect(result.size).toBe(1)
            expect(result.get(0)?.id).toBe(idea.id)
            expect(result.get(0)?.details.title).toBe('Test title 1')
            done()
        })

        it('should not return ideas for other network', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'other_network', value: 10 }],
                },
                sessionData,
            )
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([0], 'kusama')

            expect(result.size).toBe(0)
            done()
        })

        it('should not return ideas for other proposalIds', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'kusama', value: 10 }],
                },
                sessionData,
            )
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([1], 'kusama')

            expect(result.size).toBe(0)
            done()
        })
    })

    describe('find one', () => {
        it('should return an existing idea', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title', content: 'content' },
                    networks: [
                        { name: 'kusama', value: 15 },
                        { name: 'polkadot', value: 14 },
                    ],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionData,
            )

            const savedIdea = (await getService().findOne(idea.id, sessionData))!

            expect(savedIdea.details.title).toBe('Test title')
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.details.content).toBe('content')
            expect(savedIdea.networks).toBeDefined()
            expect(savedIdea.networks!.length).toBe(2)
            expect(savedIdea.networks!.find((n: IdeaNetwork) => n.name === 'kusama')).toBeDefined()
            expect(savedIdea.networks!.find((n: IdeaNetwork) => n.name === 'polkadot')).toBeDefined()
            expect(savedIdea.ordinalNumber).toBeDefined()
            done()
        })

        it('should return not found for not existing idea', async (done) => {
            await expect(getService().findOne(uuid())).rejects.toThrow(NotFoundException)
            done()
        })
        it('should return own draft idea', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'kusama', value: 10 }],
                    status: IdeaStatus.Draft,
                },
                sessionData,
            )

            const savedIdea = await getService().findOne(idea.id, sessionData)

            expect(savedIdea).toBeDefined()
            done()
        })
        it('should not return other draft idea', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'kusama', value: 10 }],
                    status: IdeaStatus.Draft,
                },
                otherSessionData,
            )

            await expect(getService().findOne(idea.id, sessionData)).rejects.toThrow(NotFoundException)
            done()
        })
        it('should not return draft idea with no user', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title 1' },
                    networks: [{ name: 'kusama', value: 10 }],
                    status: IdeaStatus.Draft,
                },
                otherSessionData,
            )

            await expect(getService().findOne(idea.id)).rejects.toThrow(NotFoundException)
            done()
        })
    })

    describe('create', () => {
        it('should create and save idea with owner', async () => {
            const createdIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.ownerId).toBe(sessionData.user.id)
        })

        it('should create and save idea with default idea status', async () => {
            const createdIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.status).toBe(DefaultIdeaStatus)
        })

        it('should create and save idea with draft status', async () => {
            const createdIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                    status: IdeaStatus.Draft,
                } as CreateIdeaDto,
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.status).toBe(IdeaStatus.Draft)
        })

        it('should create and save idea with active status', async () => {
            const createdIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                    status: IdeaStatus.Active,
                } as CreateIdeaDto,
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.status).toBe(IdeaStatus.Active)
        })

        it('should add auto generated ordinal number', async () => {
            const createdIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.ordinalNumber).toBeDefined()
        })

        it('should auto increment ordinal number', async () => {
            const createdFirstIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            const createdSecondIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 1 } as IdeaNetworkDto],
                } as CreateIdeaDto,
                sessionData,
            )
            expect(createdSecondIdea.ordinalNumber).toBe(createdFirstIdea.ordinalNumber + 1)
        })

        it('should create and save idea with all valid data', async (done) => {
            const createdIdea = await getService().create(
                {
                    details: {
                        title: 'Test title',
                        content: 'Test content',
                        field: 'Test field',
                        contact: 'Test contact',
                        portfolio: 'Test portfolio',
                        links: ['Test link'],
                    },
                    networks: [{ name: 'kusama', value: 10 }],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.details.title).toBe('Test title')
            expect(savedIdea.details.content).toBe('Test content')
            expect(savedIdea.details.field).toBe('Test field')
            expect(savedIdea.details.contact).toBe('Test contact')
            expect(savedIdea.details.portfolio).toBe('Test portfolio')
            expect(savedIdea.details.links).toEqual(JSON.stringify(['Test link']))
            done()
        })

        it('should create and save idea with networks', async (done) => {
            const createdIdea = await getService().create(
                { details: { title: 'Test title' }, networks: [{ name: 'kusama', value: 10 }] },
                sessionData,
            )
            const savedIdea = await getService().findOne(createdIdea.id, sessionData)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.details.title).toBe('Test title')
            expect(savedIdea.networks!.length).toBe(1)
            expect(savedIdea.networks![0].name).toBe('kusama')
            expect(savedIdea.networks![0].value).toBe('10.000000000000000')
            done()
        })
    })

    describe('update', () => {
        it('should update and save idea with updated networks', async () => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 44 }],
                },
                sessionData,
            )
            await getService().update(
                {
                    networks: [{ ...idea.networks[0], value: 249 }],
                },
                idea.id,
                sessionData,
            )
            const savedIdea = await getService().findOne(idea.id, sessionData)
            expect(savedIdea.networks[0].name).toBe('kusama')
            expect(savedIdea.networks[0].value).toBe('249.000000000000000')
        })
        it('should throw not found if wrong id', async (done) => {
            await expect(getService().update({}, uuid(), sessionData)).rejects.toThrow(NotFoundException)
            done()
        })
        it('should update and save idea with updated status', async () => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 44 }],
                },
                sessionData,
            )
            await getService().update({ status: IdeaStatus.Active }, idea.id, sessionData)
            const savedIdea = await getService().findOne(idea.id, sessionData)
            expect(savedIdea.status).toBe(IdeaStatus.Active)
        })

        it('should throw forbidden exception when trying to update not own idea', async (done) => {
            const idea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 44 }],
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
    })

    describe('delete', () => {
        it('should delete idea', async (done) => {
            const createdIdea = await getService().create(
                { details: { title: 'Test title' }, networks: [{ name: 'kusama', value: 42 }] },
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
            const createdIdea = await getService().create(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: 'kusama', value: 42 }],
                    status: IdeaStatus.Active,
                },
                sessionData,
            )

            const otherUser = await createSessionData({ username: 'otherUser', email: 'other@email.com' })

            await expect(getService().delete(createdIdea.id, otherUser)).rejects.toThrow(ForbiddenException)
            done()
        })
    })
})
