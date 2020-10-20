import { INestApplication } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers';
import { Idea } from './idea.entity';
import { IdeaNetwork } from './ideaNetwork.entity';
import { IdeasService } from './ideas.service';

const baseUrl = '/api/v1/ideas'

export async function createIdea(title: string, networks?: CreateIdeNetworkDto[], app: INestApplication = beforeSetupFullApp().get()) {
    const idea: CreateIdeaDto = { title, networks }
    const result = await app.get(IdeasService).save(idea)
    return result
}


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
            await createIdea('Test title')

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

            const body = result.body as Array<Idea>
            const actualIdea1 = body.find(p => p.title === 'Test title1')
            expect(actualIdea1).toBeDefined

            const actualIdea2 = body.find(p => p.title === 'Test title2')
            expect(actualIdea2).toBeDefined
        })
    })

    describe('GET /:id', () => {
        it('should return an existing idea', async () => {
            const idea = await createIdea('Test title', [{name: 'kusama'}, {name: 'polkadot'}])

            const result = await request(app())
                .get(`${baseUrl}/${idea.id}`)

            const body = result.body as Idea
            expect(body.title).toBe('Test title')
            expect(body.networks).toBeDefined()
            expect(body.networks!.length).toBe(2)
            expect(body.networks!.find((n: IdeaNetwork) => n.name === 'kusama')).toBeDefined
            expect(body.networks!.find((n: IdeaNetwork) => n.name === 'polkadot')).toBeDefined
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
                .send({ title: 'Test title' })
                .expect(201)
        })

        it('should return created for all valid data', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({ title: 'Test title', networks: [{name: 'kusama', value: 10}] })
                .expect(201)
        })

        it('should return created idea for valid data', async () => {
            const actual = await request(app())
                .post(`${baseUrl}`)
                .send({ title: 'Test title', networks: [{name: 'kusama', value: 10}] })

            const body = actual.body
            expect(uuidValidate(body.id)).toBe(true)
            expect(body.title).toBe('Test title')
            expect(body.networks!.length).toBe(1)
            expect(body.networks[0].name).toBe('kusama')
            expect(body.networks[0].value).toBe(10)
        })

        it('should create a idea and networks', async () => {
            const result = await request(app())
                .post(`${baseUrl}`)
                .send({ title: 'Test title', networks: [{name: 'kusama', value: 10}] })

            const ideasService = app.get().get(IdeasService)
            const actual = await ideasService.findOne(result.body.id)
            expect(actual).toBeDefined()
            expect(actual!.title).toBe('Test title')
            expect(actual!.networks!.length).toBe(1)
            expect(actual!.networks![0].name).toBe('kusama')
            expect(actual!.networks![0].value).toBe(10)
        })

        it('should return bad request for empty title', async () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({ title: '' })
                .expect(201)
        })
    })
})