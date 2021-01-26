import {INestApplication} from "@nestjs/common";
import {getRepositoryToken} from "@nestjs/typeorm";
import {AppModule} from "../app.module";
import {BlockchainService} from "../blockchain/blockchain.service";
import {IdeaDto} from "../ideas/dto/idea.dto";
import {Idea} from "../ideas/idea.entity";
import {IdeaNetwork} from "../ideas/ideaNetwork.entity";
import {IdeasService} from "../ideas/ideas.service";
import {createIdea} from "../ideas/spec.helpers";
import {cleanDatabase, createTestingApp, request} from '../utils/spec.helpers';
import {ProposalDto} from "./dto/proposal.dto";
import {mockedBlockchainService} from "./spec.helpers";

const baseUrl = '/api/v1/proposals'

describe(`/api/v1/proposals`, () => {
    let app: INestApplication
    let idea: Idea

    beforeAll(async () => {
        app = await createTestingApp([AppModule], (builder) =>
            builder.overrideProvider(BlockchainService)
                .useValue(mockedBlockchainService))
    })

    afterAll(async () => {
        if (app) {
            await app.close()
        }
    })

    beforeEach(async () => {
        await cleanDatabase()
        idea = await createIdea({title: 'Title', networks: [{name: 'localhost', value: 10}]} as IdeaDto, app.get(IdeasService))
        idea.networks[0].blockchainProposalId = 0
        await app.get(getRepositoryToken(IdeaNetwork)).save(idea.networks[0])
    })
    describe('GET /?network=:networkName', () => {
        it('should return 200 for selected network', () => {
            return request(app)
                .get(`${baseUrl}?network=localhost`)
                .expect(200)
        })

        it('should return proposals for selected network', async () => {

            const result = await request(app)
                .get(`${baseUrl}?network=localhost`)

            expect(result.body.length).toBe(2)

            const actual1 = result.body[0] as ProposalDto
            expect(actual1.proposalIndex).toBe(0)
            expect(actual1.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(actual1.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(actual1.bond).toBe(0.001)
            expect(actual1.value).toBe(0.00000000000001)
            expect(actual1.status).toBe('submitted')
            expect(actual1.ideaId).toBe(idea.id)
            expect(actual1.title).toBe('Title')

            const actual2 = result.body[1] as ProposalDto
            expect(actual2.proposalIndex).toBe(3)
            expect(actual2.proposer).toBe('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y')
            expect(actual2.beneficiary).toBe('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw')
            expect(actual2.bond).toBe(20)
            expect(actual2.value).toBe(1000)
            expect(actual2.status).toBe('approved')
            expect(actual2.ideaId).toBeUndefined()
            expect(actual2.title).toBeUndefined()
        })

        it('should return 400 for empty network param', async () => {
            await request(app)
                .get(baseUrl)
                .expect(400)
        })
    })

    describe('GET /:proposalId?network=:networkName', () => {
        it('should return 200 for existing proposal in selected network', () => {
            return request(app)
                .get(`${baseUrl}/0?network=localhost`)
                .expect(200)
        })

        it('should return 400 for empty network param', async () => {
            await request(app)
                .get(`${baseUrl}/0`)
                .expect(400)
        })

        it('should return 404 for not existing proposal', async () => {
            await request(app)
                .get(`${baseUrl}/123?network=localhost`)
                .expect(404)
        })

        it('should return proposal details', async () => {
            const result = await request(app)
                .get(`${baseUrl}/0?network=localhost`)

            const actual = result.body as ProposalDto
            expect(actual.proposalIndex).toBe(0)
            expect(actual.proposer).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(actual.beneficiary).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(actual.bond).toBe(0.001)
            expect(actual.value).toBe(0.00000000000001)
            expect(actual.status).toBe('submitted')
            expect(actual.ideaId).toBe(idea.id)
            expect(actual.title).toBe('Title')
        })

    })
})
