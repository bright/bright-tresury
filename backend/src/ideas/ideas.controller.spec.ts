import {validate as uuidValidate} from 'uuid';
import {beforeSetupFullApp, cleanDatabase, request} from '../utils/spec.helpers';
import {Idea} from './idea.entity';
import {IdeaNetwork} from './ideaNetwork.entity';
import {IdeasService} from './ideas.service';
import {v4 as uuid} from 'uuid';
import {createIdea} from './spec.helpers';

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

        it('should return ideas', async (done) => {
            await createIdea({title: 'Test title'})

            const result = await request(app())
                .get(baseUrl)

            expect(result.body.length).toBe(1)
            expect(result.body[0].title).toBe('Test title')
            done()
        })

        it('should return ideas for selected network', async (done) => {
            await createIdea({title: 'Test title1', networks: [{name: 'kusama', value: 15}]})
            await createIdea({title: 'Test title2', networks: [{name: 'kusama', value: 4}, {name: 'polkadot', value: 20}]})
            await createIdea({title: 'Test title3', networks: [{name: 'polkadot', value: 11}]})

            const result = await request(app())
                .get(`${baseUrl}?network=kusama`)

            expect(result.body.length).toBe(2)

            const body = result.body as Idea[]
            const actualIdea1 = body.find((idea: Idea) => idea.title === 'Test title1')
            expect(actualIdea1).toBeDefined()
            expect(actualIdea1!.networks[0].name).toBe('kusama')

            const actualIdea2 = body.find((idea: Idea) => idea.title === 'Test title2')
            expect(actualIdea2).toBeDefined()
            expect(actualIdea2!.networks[0].name).toBe('kusama')
            done()
        })
    })

    describe('GET /:id', () => {
        it('should return an existing idea', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 241}, {name: 'polkadot', value: 12}],
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
            done()
        })

        it('should return not found for not existing idea', () => {
            return request(app())
                .get(`${baseUrl}/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b`)
                .expect(404)
        })

        it('should return bad request for not valid uuid param', () => {
            return request(app())
                .get(`${baseUrl}/not_valid`)
                .expect(400)
        })
    })

    describe('POST', () => {
        it('should return created for minimal valid data', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 3}]})
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

        it('should return bad request if network without a value', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: null}]})
                .expect(400)
        })

        it('should return bad request if network without a name', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: null, value: 5}]})
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

        it('should return bad request for empty title', () => {
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
                    links: ['Test link'],
                })
                .expect(201)
        })

        it('should return created idea for valid data', async (done) => {
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
            done()
        })

        it('should create an idea and networks', async (done) => {
            const result = await request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 10}]})

            const ideasService = app.get().get(IdeasService)
            const actual = await ideasService.findOne(result.body.id)
            expect(actual).toBeDefined()
            expect(actual!.title).toBe('Test title')
            expect(actual!.networks!.length).toBe(1)
            expect(actual!.networks![0].name).toBe('kusama')
            expect(Number(actual!.networks![0].value)).toBe(10)
            done()
        })
    })

    describe('PATCH', () => {
        it('should return status ok for minimal patch data', async (done) => {
            const idea = await createIdea({title: 'Test title'})
            await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'})
                .expect(200)
            done()
        })
        it('should return not found if wrong id', () => {
            return request(app())
                .patch(`${baseUrl}/${uuid()}`)
                .send({title: 'Test title 2'})
                .expect(404)
        })
        it('should patch title', async (done) => {
            const idea = await createIdea({title: 'Test title'})
            const response = await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'})
                .expect(200)
            expect(response.body.title).toBe('Test title 2')
            done()
        })
        it('should patch network', async (done) => {
            const idea = await createIdea({title: 'Test title', networks: [{name: 'kusama', value: 13}]})
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
            done()
        })
        it('should patch links', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 13}],
                links: ['The link']
            })
            const response = await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    links: ['patched link']
                })
                .expect(200)
            expect(response.body.links[0]).toBe('patched link')
            done()
        })
        it('should keep previous data for not patched properties', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 10}],
                beneficiary: 'abcd-1234',
                content: 'Test content'
            })
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
            done()
        })
    })
    describe('DELETE', () => {
        it('should delete idea', async (done) => {
            const idea = await createIdea({title: 'Test title'})
            await request(app())
                .delete(`${baseUrl}/${idea.id}`)
                .expect(200)
            await request(app())
                .get(`${baseUrl}/${idea.id}`)
                .send()
                .expect(404)
            done()
        })
        it('should delete idea with networks', async (done) => {
            const idea = await createIdea({title: 'Test title', networks: [{name: 'polkadot', value: 47}]})
            await request(app())
                .del(`${baseUrl}/${idea.id}`)
                .send()
                .expect(200)
            await request(app())
                .get(`${baseUrl}/${idea.id}`)
                .expect(404)
            done()
        })
        it('should return not found if wrong id', (done) => {
            request(app())
                .del(`${baseUrl}/${uuid()}`)
                .expect(404)
                .end(done)
        })
    })
})
