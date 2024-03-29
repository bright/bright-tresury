import { HttpStatus } from '@nestjs/common'
import { v4 as uuid, validate as uuidValidate } from 'uuid'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, request, NETWORKS } from '../utils/spec.helpers'
import { IdeaNetworkDto } from './dto/idea-network.dto'
import { IdeaDto } from './dto/idea.dto'
import { IdeasService } from './ideas.service'
import { DefaultIdeaStatus, IdeaStatus } from './entities/idea-status'
import { createIdea, createSessionData } from './spec.helpers'
import { NetworkPlanckValue } from '../utils/types'

const baseUrl = '/api/v1/ideas'

describe(`/api/v1/ideas`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(IdeasService)

    let sessionHandler: SessionHandler

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
    })

    describe('GET', () => {
        it('should return 200', () => {
            return request(app()).get(baseUrl).expect(200)
        })

        it('should return ideas', async (done) => {
            await createIdea({ details: { title: 'Test title' } }, sessionHandler.sessionData)

            const result = await request(app()).get(baseUrl)

            expect(result.body.length).toBe(1)
            expect(result.body[0].details.title).toBe('Test title')
            done()
        })

        it('should return ideas for selected network', async (done) => {
            await createIdea(
                {
                    details: { title: 'Test title1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '15' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )
            await createIdea(
                {
                    details: { title: 'Test title2' },
                    networks: [
                        { name: NETWORKS.POLKADOT, value: '4' as NetworkPlanckValue },
                        { name: NETWORKS.KUSAMA, value: '20' as NetworkPlanckValue },
                    ],
                },
                sessionHandler.sessionData,
            )
            await createIdea(
                {
                    details: { title: 'Test title3' },
                    networks: [{ name: NETWORKS.POLKADOT, value: '11' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )

            const result = await request(app()).get(`${baseUrl}?network=${NETWORKS.KUSAMA}`)

            expect(result.body.length).toBe(2)

            const body = result.body as IdeaDto[]
            const actualIdea1 = body.find((idea: IdeaDto) => idea.details.title === 'Test title1')
            expect(actualIdea1).toBeDefined()
            expect(actualIdea1!.networks[0].name).toBe(NETWORKS.KUSAMA)

            const actualIdea2 = body.find((idea: IdeaDto) => idea.details.title === 'Test title2')
            expect(actualIdea2).toBeDefined()
            const polkadotNetwork = actualIdea2!.networks!.find((n: IdeaNetworkDto) => n.name === NETWORKS.POLKADOT)
            expect(polkadotNetwork).toBeDefined()
            expect(polkadotNetwork!.value).toBe('4')
            expect(polkadotNetwork!.extrinsic).toBeNull()
            expect(polkadotNetwork!.status).toBe('active')

            expect(actualIdea2!.networks.find((n) => n.name === NETWORKS.KUSAMA)).toBeDefined()
            done()
        })

        it('should not return draft ideas for anonymous user', async (done) => {
            await createIdea(
                {
                    details: { title: 'Test title1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '15' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                sessionHandler.sessionData,
            )

            const result = await request(app()).get(baseUrl)

            expect(result.body.length).toBe(0)

            done()
        })

        it('should return draft ideas of a logged in user', async (done) => {
            await createIdea(
                {
                    details: { title: 'Test title1' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '15' as NetworkPlanckValue }],
                    status: IdeaStatus.Draft,
                },
                sessionHandler.sessionData,
            )

            const result = await sessionHandler.authorizeRequest(request(app()).get(baseUrl))

            expect(result.body.length).toBe(1)

            const body = result.body as IdeaDto[]
            expect(body[0].status).toBe('draft')
            done()
        })

        it('should not return draft ideas of other users', async (done) => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            await createIdea({ details: { title: 'Test title' }, status: IdeaStatus.Draft }, otherUser)

            const result = await sessionHandler.authorizeRequest(request(app()).get(baseUrl))

            expect(result.body.length).toBe(0)
            done()
        })

        it('should return active ideas of other users', async (done) => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const idea = await createIdea({ details: { title: 'Test title' }, status: IdeaStatus.Active }, otherUser)

            const result = await sessionHandler.authorizeRequest(request(app()).get(baseUrl))

            expect(result.body.length).toBe(1)
            const body = result.body as IdeaDto[]
            expect(body[0].id).toBe(idea.id)
            expect(body[0].status).toBe('active')
            done()
        })
    })

    describe('GET /:id', () => {
        it('should return an existing idea', async (done) => {
            const idea = await createIdea(
                {
                    details: {
                        title: 'Test title',
                        content: 'content',
                        contact: 'contact',
                        field: 'field',
                        links: ['http://example.com'],
                        portfolio: 'portfolio',
                    },
                    networks: [
                        { name: NETWORKS.KUSAMA, value: '241' as NetworkPlanckValue },
                        { name: NETWORKS.POLKADOT, value: '12' as NetworkPlanckValue },
                    ],
                    beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                },
                sessionHandler.sessionData,
            )

            const result = await request(app()).get(`${baseUrl}/${idea.id}`)

            const body = result.body as IdeaDto
            expect(body.details.title).toBe(idea.details.title)
            expect(body.beneficiary?.web3address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.networks).toBeDefined()
            expect(body.networks!.length).toBe(2)

            const kusamaNetwork = body.networks!.find((n: IdeaNetworkDto) => n.name === NETWORKS.KUSAMA)
            expect(kusamaNetwork).toBeDefined()
            expect(kusamaNetwork!.value).toBe('241')
            expect(kusamaNetwork!.extrinsic).toBeNull()
            expect(kusamaNetwork!.status).toBe('active')

            const polkadotNetwork = body.networks!.find((n: IdeaNetworkDto) => n.name === NETWORKS.POLKADOT)
            expect(polkadotNetwork).toBeDefined()
            expect(polkadotNetwork!.value).toBe('12')
            expect(polkadotNetwork!.extrinsic).toBeNull()
            expect(polkadotNetwork!.status).toBe('active')
            done()
        })

        it('should return not found for not existing idea', () => {
            return request(app()).get(`${baseUrl}/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b`).expect(404)
        })

        it('should return not found for draft idea for anonymous user', async () => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const idea = await createIdea({ details: { title: 'Test title' }, status: IdeaStatus.Draft }, otherUser)
            return request(app()).get(`${baseUrl}/${idea.id}`).expect(404)
        })

        it('should return not found for draft idea of other user', async () => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const idea = await createIdea({ details: { title: 'Test title' }, status: IdeaStatus.Draft }, otherUser)
            return sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}/${idea.id}`)).expect(404)
        })

        it('should return active idea of other user', async () => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const idea = await createIdea({ details: { title: 'Test title' }, status: IdeaStatus.Active }, otherUser)
            const result = await sessionHandler
                .authorizeRequest(request(app()).get(`${baseUrl}/${idea.id}`))
                .expect(200)

            expect(result.body.id).toBe(idea.id)
            expect(result.body.status).toBe('active')
        })

        it('should return draft idea of a logged in user', async () => {
            const idea = await createIdea(
                { details: { title: 'Test title' }, status: IdeaStatus.Draft },
                sessionHandler.sessionData,
            )
            const result = await sessionHandler
                .authorizeRequest(request(app()).get(`${baseUrl}/${idea.id}`))
                .expect(200)

            expect(result.body.id).toBe(idea.id)
            expect(result.body.status).toBe('draft')
        })

        it('should return bad request for not valid uuid param', () => {
            return request(app()).get(`${baseUrl}/not_valid`).expect(400)
        })
    })

    describe('POST', () => {
        it('should return created for minimal valid data', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: [{ name: NETWORKS.KUSAMA, value: '3' }] }),
                )
                .expect(201)
        })

        it('should return created for all valid data', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
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
                        }),
                )
                .expect(201)
        })

        it('should return idea data for valid data', async (done) => {
            const kusamaEncodedAddress = 'GABitXHtTEcAkCQYJyK7LQijTmiU62rWDzNCbwg8cvrKfWe'
            const baseEncodedAddress = '5Fea4aBRG6DgR6NxmcAGDP3iasVUfRDg3r9cowfiepiMaa6h'
            const response = await sessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl)
                    .send({
                        details: {
                            title: 'Test title',
                            content: 'Test content',
                            field: 'Test field',
                            contact: 'Test contact',
                            portfolio: 'Test portfolio',
                            links: ['https://goodlink.com'],
                        },
                        networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                        beneficiary: kusamaEncodedAddress,
                    }),
            )

            const body = response.body
            expect(uuidValidate(body.id)).toBe(true)
            expect(body.beneficiary.web3address).toBe(baseEncodedAddress)
            expect(body.networks!.length).toBe(1)
            expect(body.networks[0].name).toBe(NETWORKS.KUSAMA)
            expect(body.networks[0].value).toBe('10')
            expect(body.details.title).toBe('Test title')
            expect(body.details.content).toBe('Test content')
            expect(body.details.contact).toBe('Test contact')
            expect(body.details.portfolio).toBe('Test portfolio')
            expect(body.details.links).toStrictEqual(['https://goodlink.com'])
            expect(body.ordinalNumber).toBeDefined()
            expect(body.status).toBe(DefaultIdeaStatus)
            done()
        })

        it('should create an idea and networks', async (done) => {
            const result = await sessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl)
                    .send({
                        details: { title: 'Test title' },
                        networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    }),
            )

            const ideasService = app.get().get(IdeasService)
            const { entity: actual } = await ideasService.findOne(result.body.id, sessionHandler.sessionData)
            expect(actual).toBeDefined()
            expect(actual!.details.title).toBe('Test title')
            expect(actual!.networks!.length).toBe(1)
            expect(actual!.networks![0].name).toBe(NETWORKS.KUSAMA)
            expect(actual!.networks![0].value).toBe('10')
            done()
        })

        it('should return forbidden for not authorized request', () => {
            return request(app())
                .post(baseUrl)
                .send({ details: { title: 'Test title' }, networks: [{ name: NETWORKS.KUSAMA, value: '3' }] })
                .expect(HttpStatus.FORBIDDEN)
        })

        it('should return forbidden for not verified user', async (done) => {
            const sessionHandlerNotVerified = await createUserSessionHandler(
                app(),
                'not.verified@example.com',
                'not-verified',
            )
            await sessionHandlerNotVerified
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: [{ name: NETWORKS.KUSAMA, value: '3' }] }),
                )
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return bad request if no networks', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: null }),
                )
                .expect(400)
        })

        it('should return bad request if empty networks', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: [] }),
                )
                .expect(400)
        })

        it('should return bad request if network without a value', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: [{ name: NETWORKS.KUSAMA, value: null }] }),
                )
                .expect(400)
        })

        it('should return bad request if network without a name', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: [{ name: null, value: '5' }] }),
                )
                .expect(400)
        })

        it('should return bad request if network without a name and value', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: 'Test title' }, networks: [{ name: null }] }),
                )
                .expect(400)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network has a value less than zero`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            details: { title: 'Test title' },
                            networks: [{ name: NETWORKS.POLKADOT, value: '-1' }],
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network has a value not included in configuration`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            details: { title: 'Test title' },
                            networks: [{ name: 'bad-network-name', value: '-1' }],
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it('should return bad request if links are not array', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            details: { title: 'Test title', links: 'link' },
                            networks: [{ name: NETWORKS.KUSAMA, value: '2' }],
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it('should return bad request for empty title', () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({ details: { title: '' }, networks: [{ name: NETWORKS.KUSAMA, value: '2' }] }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it('should return bad request for wrong beneficiary', () => {
            const beneficiary = '5GrwvaEF5zXb26Fz9rcQpDW'
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            details: { title: 'Test title' },
                            networks: [{ name: NETWORKS.KUSAMA, value: '2' }],
                            beneficiary,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it('should return created for empty beneficiary', () => {
            const beneficiary = ''
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            details: { title: 'Test title' },
                            networks: [{ name: NETWORKS.KUSAMA, value: '2' }],
                            beneficiary,
                        }),
                )
                .expect(201)
        })

        it('should return created for correct beneficiary', () => {
            const beneficiary = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl)
                        .send({
                            details: { title: 'Test title' },
                            networks: [{ name: NETWORKS.KUSAMA, value: '2' }],
                            beneficiary,
                        }),
                )
                .expect(201)
        })

        it('should pass base encoded beneficiary address to service method', async () => {
            const kusamaEncodedAddress = 'GABitXHtTEcAkCQYJyK7LQijTmiU62rWDzNCbwg8cvrKfWe'
            const baseEncodedAddress = '5Fea4aBRG6DgR6NxmcAGDP3iasVUfRDg3r9cowfiepiMaa6h'
            const spyOnService = jest.spyOn(getService(), 'create')
            await sessionHandler.authorizeRequest(
                request(app())
                    .post(baseUrl)
                    .send({
                        beneficiary: kusamaEncodedAddress,
                        details: { title: 'Test title' },
                        networks: [{ name: NETWORKS.KUSAMA, value: '3' }],
                    }),
            )
            expect(spyOnService).toHaveBeenCalledWith(
                expect.objectContaining({ beneficiary: baseEncodedAddress }),
                expect.anything(),
            )
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for empty string in links array`, () => {
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: '3' }]
            const links = ['', 'https://goodlink.com']
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for undefined value in links array`, () => {
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: 3 }]
            const links = [undefined, 'https://goodlink.com']
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for null value in links array`, () => {
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: '3' }]
            const links = [null, 'https://goodlink.com']
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for numbers in links array`, () => {
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: '3' }]
            const links = [123, 'https://goodlink.com']
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for too long links (length over 1000) in links array`, () => {
            const link = `https://${'x'.repeat(1000)}.com`
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: '3' }]
            const links = [link, 'https://goodlink.com']
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid links`, () => {
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: '3' }]
            const links = ['not a valid link']
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for too many links (more than 10) in links array`, () => {
            const links = new Array(11).map((_, index) => `https://goodlink${index}.com`)
            const title = ''
            const networks = [{ name: NETWORKS.KUSAMA, value: '3' }]
            return sessionHandler
                .authorizeRequest(request(app()).post(baseUrl).send({ details: { title, links }, networks }))
                .expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('PATCH', () => {
        it('should return status ok for minimal patch data', async (done) => {
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandler.sessionData)
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}/${idea.id}`)
                        .send({ details: { title: 'Test title 2' } }),
                )
                .expect(200)
            done()
        })

        it('should patch title', async (done) => {
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandler.sessionData)
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}/${idea.id}`)
                        .send({ details: { title: 'Test title 2' } }),
                )
                .expect(200)
            expect(response.body.details.title).toBe('Test title 2')
            done()
        })

        it('should patch network', async (done) => {
            const idea = await createIdea(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.KUSAMA, value: '13' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}/${idea.id}`)
                        .send({
                            networks: [
                                {
                                    ...idea.networks[0],
                                    value: '33',
                                },
                            ],
                        }),
                )
                .expect(200)
            expect(response.body.networks[0].id).toBe(idea.networks[0].id)
            expect(response.body.networks[0].value).toBe('33')
            done()
        })

        it('should return bad request if links are not array', async (done) => {
            const idea = await createIdea(
                {
                    details: {
                        title: 'Test title',
                        links: ['https://goodlink.com'],
                    },
                    networks: [{ name: NETWORKS.KUSAMA, value: '13' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}/${idea.id}`)
                        .send({
                            details: {
                                links: 'https://goodlink.com',
                            },
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
            done()
        })

        it('should patch idea status', async (done) => {
            const idea = await createIdea(
                {
                    details: {
                        title: 'Test title',
                    },
                    networks: [{ name: NETWORKS.KUSAMA, value: '13' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )
            const response = await sessionHandler
                .authorizeRequest(
                    request(app()).patch(`${baseUrl}/${idea.id}`).send({
                        status: IdeaStatus.Active,
                    }),
                )
                .expect(HttpStatus.OK)
            expect(response.body.status).toBe(IdeaStatus.Active)
            done()
        })

        it('should return bad request if idea status is unknown', async (done) => {
            const idea = await createIdea(
                {
                    details: {
                        title: 'Test title',
                    },
                    networks: [{ name: NETWORKS.KUSAMA, value: '13' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )
            await sessionHandler
                .authorizeRequest(
                    request(app()).patch(`${baseUrl}/${idea.id}`).send({
                        status: 'unknown_idea_status',
                    }),
                )
                .expect(HttpStatus.BAD_REQUEST)
            done()
        })

        it('should keep previous data for not patched properties', async (done) => {
            const idea = await createIdea(
                {
                    details: {
                        title: 'Test title',
                        content: 'Test content',
                    },
                    networks: [{ name: NETWORKS.KUSAMA, value: '10' as NetworkPlanckValue }],
                    beneficiary: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                },
                sessionHandler.sessionData,
            )
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}/${idea.id}`)
                        .send({ details: { title: 'Test title 2' } }),
                )
                .expect(HttpStatus.OK)
            const body = response.body
            expect(body.details.title).not.toBe('Test title')
            expect(body.beneficiary.web3address).toBe('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')
            expect(body.details.content).toBe('Test content')
            expect(body.networks[0].name).toBe(NETWORKS.KUSAMA)
            done()
        })

        it('should not patch ordinal number', async (done) => {
            const idea = await createIdea({}, sessionHandler.sessionData)
            const ordinalNumber = idea.ordinalNumber + 13
            const response = await sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}/${idea.id}`).send({ ordinalNumber }))
                .expect(HttpStatus.OK)
            expect(response.body.ordinalNumber).not.toBe(ordinalNumber)
            done()
        })

        it('should not pass ordinal number to the service', async (done) => {
            const spyOnPatchIdea = jest.spyOn(getService(), 'update')
            const idea = await createIdea({}, sessionHandler.sessionData)
            const ordinalNumber = idea.ordinalNumber + 13
            await sessionHandler
                .authorizeRequest(request(app()).patch(`${baseUrl}/${idea.id}`).send({ ordinalNumber }))
                .expect(HttpStatus.OK)
            expect(spyOnPatchIdea).toHaveBeenCalledWith(
                {},
                idea.id,
                expect.objectContaining({
                    user: expect.objectContaining({ id: sessionHandler.sessionData.user.id }),
                }),
            )
            done()
        })

        it('should return forbidden for not authorized request', async (done) => {
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandler.sessionData)
            await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({ details: { title: 'Test title 2' } })
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for not verified user', async (done) => {
            const sessionHandlerNotVerified = await createUserSessionHandler(
                app(),
                'not.verified@example.com',
                'not-verified',
            )
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandlerNotVerified.sessionData)
            await sessionHandlerNotVerified
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl}/${idea.id}`)
                        .send({ details: { title: 'Test title 2' } }),
                )
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should pass base encoded beneficiary address to service method', async () => {
            const kusamaEncodedAddress = 'GABitXHtTEcAkCQYJyK7LQijTmiU62rWDzNCbwg8cvrKfWe'
            const baseEncodedAddress = '5Fea4aBRG6DgR6NxmcAGDP3iasVUfRDg3r9cowfiepiMaa6h'
            const spyOnService = jest.spyOn(getService(), 'create')
            const idea = await createIdea({}, sessionHandler.sessionData)

            await sessionHandler.authorizeRequest(
                request(app()).patch(`${baseUrl}/${idea.id}`).send({ beneficiary: kusamaEncodedAddress }),
            )

            expect(spyOnService).toHaveBeenCalledWith(
                expect.objectContaining({ beneficiary: baseEncodedAddress }),
                expect.anything(),
            )
        })
    })
    describe('DELETE', () => {
        it('should delete idea', async (done) => {
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandler.sessionData)
            await sessionHandler.authorizeRequest(request(app()).delete(`${baseUrl}/${idea.id}`)).expect(HttpStatus.OK)
            await sessionHandler.authorizeRequest(request(app()).get(`${baseUrl}/${idea.id}`)).expect(404)
            done()
        })
        it('should delete idea with networks', async (done) => {
            const idea = await createIdea(
                {
                    details: { title: 'Test title' },
                    networks: [{ name: NETWORKS.POLKADOT, value: '47' as NetworkPlanckValue }],
                },
                sessionHandler.sessionData,
            )
            await sessionHandler.authorizeRequest(request(app()).delete(`${baseUrl}/${idea.id}`)).expect(HttpStatus.OK)
            await sessionHandler
                .authorizeRequest(request(app()).get(`${baseUrl}/${idea.id}`))
                .expect(HttpStatus.NOT_FOUND)
            done()
        })
        it('should return not found if wrong id', (done) => {
            sessionHandler
                .authorizeRequest(request(app()).delete(`${baseUrl}/${uuid()}`))
                .expect(HttpStatus.NOT_FOUND)
                .end(done)
        })

        it('should return forbidden for not authorized request', async (done) => {
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandler.sessionData)
            await request(app()).delete(`${baseUrl}/${idea.id}`).expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for not verified user', async (done) => {
            const sessionHandlerNotVerified = await createUserSessionHandler(
                app(),
                'not.verified@example.com',
                'not-verified',
            )
            const idea = await createIdea({ details: { title: 'Test title' } }, sessionHandlerNotVerified.sessionData)
            await sessionHandlerNotVerified
                .authorizeRequest(request(app()).delete(`${baseUrl}/${idea.id}`))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for idea created by other user', async (done) => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const idea = await createIdea({ details: { title: 'Test title' } }, otherUser)
            await sessionHandler
                .authorizeRequest(request(app()).delete(`${baseUrl}/${idea.id}`))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })
    })
})
