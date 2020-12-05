import {BadRequestException, INestApplication, NotFoundException} from '@nestjs/common';
import {beforeSetupFullApp, cleanDatabase, request} from '../utils/spec.helpers';
import {IdeaNetwork} from './ideaNetwork.entity';
import {IdeasService} from './ideas.service';
import {IdeaNetworkDto} from "./dto/ideaNetwork.dto";
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {v4 as uuid} from 'uuid';

describe(`/api/v1/ideas`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeasService)

    beforeEach(async () => {
        await cleanDatabase()
    })
    describe('find', () => {
        it('should return ideas', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}]
            })
            await getService().create({
                title: 'Test title 2',
                networks: [{name: 'kusama', value: 10}]
            })

            const ideas = await getService().find()

            expect(ideas.length).toBe(2)
            done()
        })
        it('should return polkadot ideas', async (done) => {
            await getService().create({
                title: 'Test title 1',
                networks: [{name: 'kusama', value: 10}]
            })
            await getService().create({
                title: 'Test title 2',
                networks: [{name: 'polkadot', value: 10}]
            })
            await getService().create({
                title: 'Test title 2',
                networks: [{name: 'polkadot', value: 10}]
            })

            const ideas = await getService().find('polkadot')

            expect(ideas.length).toBe(2)
            done()
        })
    })

    describe('find one', () => {
        it('should return an existing idea', async (done) => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama'}, {name: 'polkadot'}],
                beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                content: 'content'
            })

            const savedIdea = (await getService().findOne(idea.id))!

            expect(savedIdea.title).toBe('Test title')
            expect(savedIdea.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(savedIdea.content).toBe('content')
            expect(savedIdea.networks).toBeDefined()
            expect(savedIdea.networks!.length).toBe(2)
            expect(savedIdea.networks!.find((n: IdeaNetwork) => n.name === 'kusama')).toBeDefined()
            expect(savedIdea.networks!.find((n: IdeaNetwork) => n.name === 'polkadot')).toBeDefined()
            done()
        })

        it('should return not found for not existing idea', async (done) => {
            await expect(getService().findOne(uuid()))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
    })

    describe('create', () => {
        it('should create and save idea', async () => {
            const createdIdea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 1} as IdeaNetworkDto]
            } as CreateIdeaDto)
            const savedIdea = await getService().find(createdIdea.id)
            expect(savedIdea).toBeDefined()
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
            })
            const savedIdea = await getService().findOne(createdIdea.id)
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
            const createdIdea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 10}]})
            const savedIdea = await getService().findOne(createdIdea.id)
            expect(savedIdea).toBeDefined()
            expect(savedIdea.title).toBe('Test title')
            expect(savedIdea.networks!.length).toBe(1)
            expect(savedIdea.networks![0].name).toBe('kusama')
            expect(savedIdea.networks![0].value).toBe(10)
            done()
        })
    })

    describe('update', () => {
        it('should update and save idea with updated title', async () => {
            const idea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 44}]})
            const updatedIdea = await getService().update({title: 'Test title updated'}, idea.id)
            expect(updatedIdea.title).toBe('Test title updated')
        })
        it('should update and save idea with updated title and not updated other properties', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}],
                portfolio: 'Test portfolio'
            })
            await getService().update({title: 'Test title updated'}, idea.id)
            const savedIdea = await getService().findOne(idea.id)
            expect(savedIdea.title).toBe('Test title updated')
            expect(savedIdea.networks[0].name).toBe('kusama')
            expect(savedIdea.networks[0].value).toBe(44)
            expect(savedIdea.portfolio).toBe('Test portfolio')
        })
        it('should update and save idea with updated links', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}],
                links: ['Test link']
            })
            await getService().update({links: ['New Link']}, idea.id)
            const savedIdea = await getService().findOne(idea.id)
            expect(savedIdea.links).toBe(JSON.stringify(['New Link']))
        })
        it('should update and save idea with updated networks', async () => {
            const idea = await getService().create({
                title: 'Test title',
                networks: [{name: 'kusama', value: 44}],
            })
            await getService().update({
                networks: [{...idea.networks[0], value: 249}]
            }, idea.id)
            const savedIdea = await getService().findOne(idea.id)
            expect(savedIdea.networks[0].name).toBe('kusama')
            expect(savedIdea.networks[0].value).toBe(249)
        })
        it('should throw not found if wrong id', async (done) => {
            await expect(getService().update({}, uuid()))
                .rejects
                .toThrow(NotFoundException)
            done()
        })
    })
    describe('delete', () => {
        it('should delete idea', async (done) => {
            const createdIdea = await getService().create({title: 'Test title', networks: [{name: 'kusama', value: 42}]})
            await getService().delete(createdIdea.id)
            await expect(getService().findOne(createdIdea.id))
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
    })
})
