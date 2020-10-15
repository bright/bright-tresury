import { INestApplication } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers';
import { Proposal } from './proposal.entity';
import { ProposalNetwork } from './proposalNetwork.entity';
import { ProposalsService } from './proposals.service';

const baseUrl = '/api/v1/proposals'

export async function createProposal(title: string, networks?: string[], app: INestApplication = beforeSetupFullApp().get()) {
    const proposal: CreateProposalDto = { title, networks }
    const result = await app.get(ProposalsService).save(proposal)
    return result
}


describe(`/api/v1/proposals`, () => {
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

        it('should return proposals', async () => {
            await createProposal('Test title')

            const result = await request(app())
                .get(baseUrl)

            expect(result.body.length).toBe(1)
            expect(result.body[0].title).toBe('Test title')
        })

        it('should return proposals for selected network', async () => {
            await createProposal('Test title1', ['kusama'])
            await createProposal('Test title2', ['kusama', 'polkadot'])
            await createProposal('Test title3', ['polkadot'])

            const result = await request(app())
                .get(`${baseUrl}?network=kusama`)

            expect(result.body.length).toBe(2)

            const body = result.body as Array<Proposal>
            const actualProposal1 = body.find(p => p.title === 'Test title1')
            expect(actualProposal1).toBeDefined

            const actualProposal2 = body.find(p => p.title === 'Test title2')
            expect(actualProposal2).toBeDefined
        })
    })

    describe('GET /:id', () => {
        it('should return an existing proposal', async () => {
            const proposal = await createProposal('Test title', ['kusama', 'polkadot'])

            const result = await request(app())
                .get(`${baseUrl}/${proposal.id}`)

            const body = result.body as Proposal
            expect(body.title).toBe('Test title')
            expect(body.networks).toBeDefined()
            expect(body.networks!.length).toBe(2)
            expect(body.networks!.find((n: ProposalNetwork) => n.name === 'kusama')).toBeDefined
            expect(body.networks!.find((n: ProposalNetwork) => n.name === 'polkadot')).toBeDefined
        })

        it('should return not found for not existing proposal', async () => {
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
                .send({ title: 'Test title', networks: ['kusama'] })
                .expect(201)
        })

        it('should return created proposal for valid data', async () => {
            const actual = await request(app())
                .post(`${baseUrl}`)
                .send({ title: 'Test title', networks: ['kusama'] })

            const body = actual.body
            expect(uuidValidate(body.id)).toBe(true)
            expect(body.title).toBe('Test title')
            expect(body.networks!.length).toBe(1)
            expect(body.networks[0].name).toBe('kusama')
        })

        it('should create a proposal and networks', async () => {
            const result = await request(app())
                .post(`${baseUrl}`)
                .send({ title: 'Test title', networks: ['kusama'] })

            const proposalsService = app.get().get(ProposalsService)
            const actual = await proposalsService.findOne(result.body.id)
            expect(actual).toBeDefined()
            expect(actual!.title).toBe('Test title')
            expect(actual!.networks!.length).toBe(1)
            expect(actual!.networks![0].name).toBe('kusama')
        })

        it('should return bad request for empty title', async () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({ title: '' })
                .expect(201)
        })
    })
})