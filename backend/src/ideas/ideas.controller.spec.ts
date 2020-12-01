import {validate as uuidValidate} from 'uuid';
import {beforeSetupFullApp, cleanDatabase, request} from '../utils/spec.helpers';
import {Idea} from './idea.entity';
import {IdeaNetwork} from './ideaNetwork.entity';
import {IdeasService} from './ideas.service';
import {v4 as uuid} from 'uuid';
import { createIdea } from './spec.helpers';

const baseUrl = '/api/v1/ideas'

describe(`/api/v1/ideas`, () => {
    const app = beforeSetupFullApp()

    beforeEach(async () => {
        await cleanDatabase()
    })
    describe('GET', () => {
        it('should return 200', () => {
            return request(app())
                .get(baseUrl)
                .expect(200)
        })

        it('should return ideas', async () => {
            await createIdea({ title: 'Test title' })

            const result = await request(app())
                .get(baseUrl)

            expect(result.body.length).toBe(1)
            expect(result.body[0].title).toBe('Test title')
        })

        it('should return ideas for selected network', async () => {
            await createIdea('Test title1', [{name: 'kusama'}])
            await createIdea('Test title2', [{name: 'kusama'}, {name: 'polkadot'}])
            await createIdea('Test title3', [{name: 'polkadot'}])

            const result = await request(app())
                .get(`${baseUrl}?network=kusama`)

            expect(result.body.length).toBe(2)

            const body = result.body as Idea[]
            const actualIdea1 = body.find((idea: Idea) => idea.title === 'Test title1')
            expect(actualIdea1).toBeDefined()

            const actualIdea2 = body.find((idea: Idea) => idea.title === 'Test title2')
            expect(actualIdea2).toBeDefined()
        })
    })

    describe('GET /:id', () => {
        it('should return an existing idea', async () => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{ name: 'kusama' }, { name: 'polkadot' }],
                beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                content: 'content'
            })

            const result = await request(app())
                .get(`${baseUrl}/${idea.id}`)

            const body = result.body as Idea
            expect(body.title).toBe('Test title')
            expect(body.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.content).toBe('content')
            expect(body.networks).toBeDefined()
            expect(body.networks!.length).toBe(2)
            expect(body.networks!.find((n: IdeaNetwork) => n.name === 'kusama')).toBeDefined()
            expect(body.networks!.find((n: IdeaNetwork) => n.name === 'polkadot')).toBeDefined()
        })

        it('should return not found for not existing idea', async () => {
            return request(app())
                .get(`${baseUrl}/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b`)
                .expect(404)
        })

        it('should return bad request for not valid uuid param', async () => {
            return request(app())
                .get(`${baseUrl}/not_valid`)
                .expect(400)
        })
    })

    describe('POST', () => {
        it('should return created for minimal valid data', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama'}]})
                .expect(201)
        })

        it('should return bad request if no networks', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: null})
                .expect(400)
        })

        it('should return bad request if empty networks', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: []})
                .expect(400)
        })

        it('should return bad request if links are not array', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama'}], links: 'link'})
                .expect(400)
        })

        it('should return created if links are strings array', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama'}], links: 'https://somelink.com'})
                .expect(400)
        })

        it('should return bad request for empty title', async () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: ''})
                .expect(400)
        })

        it('should return created for all valid data', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({
                    title: 'Test title',
                    networks: [{name: 'kusama', value: 10}],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    content: 'Test content',
                    field: 'Test field',
                    contact: 'Test contact',
                    portfolio: 'Test portfolio',
                    links: ['Test portfolio'],
                })
                .expect(201)
        })

        it('should return created idea for valid data', async () => {
            const response = await request(app())
                .post(`${baseUrl}`)
                .send({
                    title: 'Test title',
                    networks: [{name: 'kusama', value: 10}],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    content: 'Test content',
                    field: 'Test field',
                    contact: 'Test contact',
                    portfolio: 'Test portfolio',
                    links: ['Test link'],
                })

            const body = response.body
            expect(uuidValidate(body.id)).toBe(true)
            expect(body.title).toBe('Test title')
            expect(body.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.content).toBe('Test content')
            expect(body.networks!.length).toBe(1)
            expect(body.networks[0].name).toBe('kusama')
            expect(body.networks[0].value).toBe(10)
            expect(body.contact).toBe('Test contact')
            expect(body.portfolio).toBe('Test portfolio')
            expect(body.links).toStrictEqual(['Test link'])
        })

        it('should create a idea and networks', async () => {
            const result = await request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 10}]})

            const ideasService = app.get().get(IdeasService)
            const actual = await ideasService.findOne(result.body.id)
            expect(actual).toBeDefined()
            expect(actual!.title).toBe('Test title')
            expect(actual!.networks!.length).toBe(1)
            expect(actual!.networks![0].name).toBe('kusama')
            expect(actual!.networks![0].value).toBe(10)
        })
    })

    describe('PATCH', () => {
        it('should return status ok for minima patch data', async () => {
            const idea = await createIdea('Test title')
            return request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'})
                .expect(200)
        })
        it('should return not found if wrong id', () => {
            return request(app())
                .patch(`${baseUrl}/${uuid()}`)
                .send({title: 'Test title 2'})
                .expect(404)
        })
        it('should patch title', async () => {
            const idea = await createIdea('Test title')
            const response = await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'})
                .expect(200)
            expect(response.body.title).toBe('Test title 2')
        })
        it('should patch network', async () => {
            const idea = await createIdea('Test title', [{name: 'kusama', value: 13}])
            const response = await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    networks: [
                        {
                            ...idea.networks[0],
                            value: 33
                        }
                    ]
                })
                .expect(200)
            expect(response.body.networks[0].id).toBe(idea.networks[0].id)
            expect(response.body.networks[0].value).toBe(33)
        })
        it('should patch links', async () => {
            const idea = await createIdea('Test title', [{name: 'kusama', value: 13}], '', '', ['The link'])
            const response = await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    links: ['patched link']
                })
                .expect(200)
            expect(response.body.links[0]).toBe('patched link')
        })
        it('should keep previous data for not patched properties', async () => {
            const idea = await createIdea('Test title', [{name: 'kusama'}], 'abcd-1234', 'Test content')
            const response = await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'})
                .expect(200)
            const body = response.body
            // tslint:disable-next-line:no-console
            expect(body.title).not.toBe('Test title')
            expect(body.beneficiary).toBe('abcd-1234')
            expect(body.content).toBe('Test content')
            expect(body.networks[0].name).toBe('kusama')
        })
    })
    describe('DELETE', () => {
        it('should delete idea', async () => {
            const idea = await createIdea('Test title')
            await request(app())
                .delete(`${baseUrl}/${idea.id}`)
                .send()
                .expect(200)
            await request(app())
                .get(`${baseUrl}/${idea.id}`)
                .expect(404)
        })
        it('should delete idea with networks', async () => {
            const idea = await createIdea('Test title', [{name: 'polkadot', value: 47}])
            await request(app())
                .delete(`${baseUrl}/${idea.id}`)
                .send()
                .expect(200)
            await request(app())
                .get(`${baseUrl}/${idea.id}`)
                .expect(404)
        })
        it('should return not found if wrong id', () => {
            return request(app())
                .delete(`${baseUrl}/${uuid()}`)
                .send()
                .expect(404)
        })
    })
})
