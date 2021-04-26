import {NotFoundException, UnauthorizedException} from '@nestjs/common';
import {getRepositoryToken} from "@nestjs/typeorm";
import {v4 as uuid} from 'uuid';
import {SessionUser} from "../auth/session/session.decorator";
import {cleanAuthorizationDatabase} from "../auth/supertokens/specHelpers/supertokens.database.spec.helper";
import {beforeSetupFullApp, cleanDatabase} from '../utils/spec.helpers';
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {IdeaNetworkDto} from "./dto/ideaNetwork.dto";
import {EmptyBeneficiaryException} from "./exceptions/emptyBeneficiary.exception";
import {Idea} from './idea.entity';
import {IdeaNetwork} from './entities/ideaNetwork.entity';
import {IdeasService} from './ideas.service';
import {DefaultIdeaStatus, IdeaStatus} from "./ideaStatus";
import {createSessionUser} from "./spec.helpers";

describe(`/api/v1/ideas`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeasService)
    const getIdeasRepository = () => app.get().get(getRepositoryToken(Idea))
    const getIdeaNetworkRepository = () => app.get().get(getRepositoryToken(IdeaNetwork))

    let sessionUser: SessionUser
    let otherSessionUser: SessionUser

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()

        sessionUser = await createSessionUser()
        otherSessionUser = await createSessionUser({username: 'other', email: 'other@example.com'})
    })
    describe('find', () => {
        it('should return ideas', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Active,
            }, sessionUser)
            await getService().create({
                title: 'Test title 2',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.TurnedIntoProposal,
            }, sessionUser)

            const ideas = await getService().find()

            expect(ideas.length).toBe(2)
            done()
        })
        it('should return polkadot ideas', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Active,
            }, sessionUser)
            await getService().create({
                title: 'Test title 2',
                networks: [{name: 'polkadot', value: 10}],
                status: IdeaStatus.Active,
            }, sessionUser)
            await getService().create({
                title: 'Test title 2',
                networks: [{name: 'polkadot', value: 10}],
                status: IdeaStatus.Active,
            }, sessionUser)

            const ideas = await getService().find('polkadot')

            expect(ideas.length).toBe(2)
            done()
        })
        it('should return own draft ideas', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Draft,
            }, sessionUser)

            const ideas = await getService().find(undefined, sessionUser)

            expect(ideas.length).toBe(1)
            done()
        })
        it('should not return other draft ideas', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Draft,
            }, otherSessionUser)

            const ideas = await getService().find(undefined, sessionUser)

            expect(ideas.length).toBe(0)
            done()
        })
        it('should not return draft ideas with no user', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Draft,
            }, otherSessionUser)

            const ideas = await getService().find(undefined)

            expect(ideas.length).toBe(0)
            done()
        })
    })

    describe('findByProposalIds', () => {
        it('should return ideas for given proposalIds and network', async (done) => {
            const idea = await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}]
            }, sessionUser)
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([0], 'kusama')

            expect(result.size).toBe(1)
            expect(result.get(0)?.id).toBe(idea.id)
            expect(result.get(0)?.title).toBe('Test title 1')
            done()
        })

        it('should not return ideas for other network', async (done) => {
            const idea = await getService().create({
                title: 'Test title 1',
                networks: [{name: 'other_network', value: 10}]
            }, sessionUser)
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([0], 'kusama')

            expect(result.size).toBe(0)
            done()
        })

        it('should not return ideas for other proposalIds', async (done) => {
            const idea = await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}]
            }, sessionUser)
            idea.networks[0].blockchainProposalId = 0
            await getIdeaNetworkRepository().save(idea.networks[0])

            const result = await getService().findByProposalIds([1], 'kusama')

            expect(result.size).toBe(0)
            done()
        })
    })

    describe('find one', () => {
        it('should return an existing idea', async (done) => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 15}, {name: 'polkadot', value: 14}],
                beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                content: 'content'
            }, sessionUser)

            const savedIdea = (await getService().findOne(idea.id, sessionUser))!

            expect(savedIdea.title).toBe('Test title')
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.content).toBe('content')
            expect(savedIdea.networks).toBeDefined()
            expect(savedIdea.networks!.length).toBe(2)
            expect(savedIdea.networks!.find((n: IdeaNetwork) => n.name === 'kusama')).toBeDefined()
            expect(savedIdea.networks!.find((n: IdeaNetwork) => n.name === 'polkadot')).toBeDefined()
            expect(savedIdea.ordinalNumber).toBeDefined()
            done()
        })

        it('should return not found for not existing idea', async (done) => {
            await expect(getService().findOne(uuid()))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
        it('should return own draft idea', async (done) => {
            const idea = await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Draft,
            }, sessionUser)

            const savedIdea = await getService().findOne(idea.id, sessionUser)

            expect(savedIdea).toBeDefined()
            done()
        })
        it('should not return other draft idea', async (done) => {
            const idea = await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Draft,
            }, otherSessionUser)

            await expect(getService().findOne(idea.id, sessionUser))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
        it('should not return draft idea with no user', async (done) => {
            const idea = await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}],
                status: IdeaStatus.Draft,
            }, otherSessionUser)

            await expect(getService().findOne(idea.id))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
    })

    describe('create', () => {
        it('should create and save idea with owner', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto]
            } as CreateIdeaDto, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.ownerId).toBe(sessionUser.user.id)
        })

        it('should create and save idea with default idea status', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto]
            } as CreateIdeaDto, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea.status).toBe(DefaultIdeaStatus)
        })

        it('should create and save idea with draft status', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto],
                status: IdeaStatus.Draft
            } as CreateIdeaDto, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea.status).toBe(IdeaStatus.Draft)
        })

        it('should create and save idea with active status', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto],
                status: IdeaStatus.Active
            } as CreateIdeaDto, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea.status).toBe(IdeaStatus.Active)
        })

        it('should add auto generated ordinal number', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto]
            } as CreateIdeaDto, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea.ordinalNumber).toBeDefined()
        })

        it('should auto increment ordinal number', async () => {
            const createdFirstIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto]
            } as CreateIdeaDto, sessionUser)
            const createdSecondIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto]
            } as CreateIdeaDto, sessionUser)
            expect(createdSecondIdea.ordinalNumber).toBe(createdFirstIdea.ordinalNumber + 1)
        })

        it('should create and save idea with all valid data', async (done) => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 10}],
                beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                content: 'Test content',
                field: 'Test field',
                contact: 'Test contact',
                portfolio: 'Test portfolio',
                links: ['Test link'],
            }, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea.title).toBe('Test title')
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.content).toBe('Test content')
            expect(savedIdea.field).toBe('Test field')
            expect(savedIdea.contact).toBe('Test contact')
            expect(savedIdea.portfolio).toBe('Test portfolio')
            expect(savedIdea.links).toEqual(JSON.stringify(['Test link']))
            done()
        })

        it('should create and save idea with networks', async (done) => {
            const createdIdea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 10}]}, sessionUser)
            const savedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.title).toBe('Test title')
            expect(savedIdea.networks!.length).toBe(1)
            expect(savedIdea.networks![0].name).toBe('kusama')
            expect(savedIdea.networks![0].value).toBe('10.000000000000000')
            done()
        })
    })

    describe('update', () => {
        it('should update and save idea with updated title', async () => {
            const idea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 44}]}, sessionUser)
            const updatedIdea = await getService().update({title: 'Test title updated'}, idea.id, sessionUser)
            expect(updatedIdea.title).toBe('Test title updated')
        })
        it('should update and save idea with updated title and not updated other properties', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}],
                portfolio: 'Test portfolio'
            }, sessionUser)
            await getService().update({title: 'Test title updated'}, idea.id, sessionUser)
            const savedIdea = await getService().findOne(idea.id, sessionUser)
            expect(savedIdea.title).toBe('Test title updated')
            expect(savedIdea.networks[0].name).toBe('kusama')
            expect(savedIdea.networks[0].value).toBe('44.000000000000000')
            expect(savedIdea.portfolio).toBe('Test portfolio')
        })
        it('should update and save idea with updated links', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}],
                links: ['Test link']
            }, sessionUser)
            await getService().update({links: ['New Link']}, idea.id, sessionUser)
            const savedIdea = await getService().findOne(idea.id, sessionUser)
            expect(savedIdea.links).toBe(JSON.stringify(['New Link']))
        })
        it('should update and save idea with updated networks', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}],
            }, sessionUser)
            await getService().update({
                networks: [{...idea.networks[0], value: 249}]
            }, idea.id, sessionUser)
            const savedIdea = await getService().findOne(idea.id, sessionUser)
            expect(savedIdea.networks[0].name).toBe('kusama')
            expect(savedIdea.networks[0].value).toBe('249.000000000000000')
        })
        it('should throw not found if wrong id', async (done) => {
            await expect(getService().update({}, uuid(), sessionUser))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
        it('should update and save idea with updated status', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}]
            }, sessionUser)
            await getService().update({status: IdeaStatus.Active}, idea.id, sessionUser)
            const savedIdea = await getService().findOne(idea.id, sessionUser)
            expect(savedIdea.status).toBe(IdeaStatus.Active)
        })

        it('should throw not found exception when trying to update not own idea', async (done) => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}]
            }, sessionUser)
            const otherUser = await createSessionUser({username: 'otherUser', email: 'other@email.com'})

            await expect(getService().update({status: IdeaStatus.Active}, idea.id, otherUser))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
    })
    describe('turn into proposal', () => {
        it('should turn into proposal', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                beneficiary: uuid(),
                networks: [{name: 'kusama', value: 42}]
            }, sessionUser)
            const blockchainProposalId = 31234
            await getService().turnIdeaIntoProposalByNetworkId(createdIdea.networks[0].id, blockchainProposalId, sessionUser)
            const updatedIdea = await getService().findOne(createdIdea.id, sessionUser)
            expect(updatedIdea.status).toBe(IdeaStatus.TurnedIntoProposal)
        })
        it('should turn into proposal and update network with blockchain proposal id', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                beneficiary: uuid(),
                networks: [{name: 'kusama', value: 42}]
            }, sessionUser)
            const blockchainProposalId = 31234
            await getService().turnIdeaIntoProposalByNetworkId(createdIdea.networks[0].id, blockchainProposalId, sessionUser)
            const updatedIdeaNetwork = await getIdeaNetworkRepository().findOne(createdIdea.networks[0].id)
            expect(updatedIdeaNetwork!.blockchainProposalId).toBe(blockchainProposalId)
        })
        it('should throw not found exception for wrong network id', async () => {
            await expect(getService().turnIdeaIntoProposalByNetworkId(uuid(), 1234, sessionUser))
                .rejects
                .toThrow(NotFoundException)
        })
        it('should throw empty beneficiary exception if idea beneficiary is empty', async () => {
            const createdIdea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 42}]}, sessionUser)
            await expect(getService().turnIdeaIntoProposalByNetworkId(createdIdea.networks[0].id, 1234, sessionUser))
                .rejects
                .toThrow(EmptyBeneficiaryException)
        })
        it('should throw unauthorized exception when trying to turn not own idea', async (done) => {
            const createdIdea = await getService().create({
                title: 'Test title',
                beneficiary: uuid(),
                networks: [{name: 'kusama', value: 42}]
            }, sessionUser)
            const blockchainProposalId = 31234

            const otherUser = await createSessionUser({username: 'otherUser', email: 'other@email.com'})

            await expect(getService().turnIdeaIntoProposalByNetworkId(createdIdea.networks[0].id, blockchainProposalId, otherUser))
                .rejects
                .toThrow(UnauthorizedException)
            done()
        })
    })
    describe('delete', () => {
        it('should delete idea', async (done) => {
            const createdIdea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 42}]}, sessionUser)
            await getService().delete(createdIdea.id, sessionUser)
            await expect(getService().findOne(createdIdea.id, sessionUser))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
        it('should return not found if wrong id', async (done) => {
            await expect(getService().findOne(uuid()))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
        it('should throw not found exception when trying to delete not own idea', async (done) => {
            const createdIdea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 42}]}, sessionUser)
            const otherUser = await createSessionUser({username: 'otherUser', email: 'other@email.com'})

            await expect(getService().delete(createdIdea.id, otherUser))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
    })
})
