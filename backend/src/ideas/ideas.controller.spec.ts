import {HttpStatus} from "@nestjs/common";
import {v4 as uuid, validate as uuidValidate} from 'uuid';
import {cleanAuthorizationDatabase} from "../auth/supertokens/specHelpers/supertokens.database.spec.helper";
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler
} from "../auth/supertokens/specHelpers/supertokens.session.spec.helper";
import {beforeSetupFullApp, cleanDatabase, request} from '../utils/spec.helpers';
import {Idea} from './entities/idea.entity';
import {IdeaNetwork} from './entities/ideaNetwork.entity';
import {IdeasService} from './ideas.service';
import {DefaultIdeaStatus, IdeaStatus} from "./ideaStatus";
import {createIdea, createSessionUser} from './spec.helpers';

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
            return request(app())
                .get(baseUrl)
                .expect(200)
        })

        it('should return ideas', async (done) => {
            await createIdea({title: 'Test title'}, sessionHandler.user)

            const result = await request(app())
                .get(baseUrl)

            expect(result.body.length).toBe(1)
            expect(result.body[0].title).toBe('Test title')
            done()
        })

        it('should return ideas for selected network', async (done) => {
            await createIdea({title: 'Test title1', networks: [{name: 'kusama', value: 15}]}, sessionHandler.user)
            await createIdea({title: 'Test title2', networks: [{name: 'polkadot', value: 4}, {name: 'kusama', value: 20}]}, sessionHandler.user)
            await createIdea({title: 'Test title3', networks: [{name: 'polkadot', value: 11}]}, sessionHandler.user)

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

        it('should not return draft ideas for anonymous user', async (done) => {
            await createIdea({title: 'Test title1', networks: [{name: 'kusama', value: 15}], status: IdeaStatus.Draft}, sessionHandler.user)

            const result = await request(app())
                .get(`${baseUrl}`)

            expect(result.body.length).toBe(0)

            done()
        })


        it('should return draft ideas of a logged in user', async (done) => {
            await createIdea({title: 'Test title1', networks: [{name: 'kusama', value: 15}], status: IdeaStatus.Draft}, sessionHandler.user)

            const result = await sessionHandler.authorizeRequest(request(app())
                .get(baseUrl))

            expect(result.body.length).toBe(1)

            const body = result.body as Idea[]
            expect(body[0].status).toBe('draft')
            done()
        })

        it('should not return draft ideas of other users', async (done) => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            await createIdea({title: 'Test title', status: IdeaStatus.Draft}, otherUser)

            const result = await sessionHandler.authorizeRequest(request(app())
                .get(baseUrl))

            expect(result.body.length).toBe(0)
            done()
        })

        it('should return active ideas of other users', async (done) => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            const idea = await createIdea({title: 'Test title', status: IdeaStatus.Active}, otherUser)

            const result = await sessionHandler.authorizeRequest(request(app())
                .get(baseUrl))

            expect(result.body.length).toBe(1)
            const body = result.body as Idea[]
            expect(body[0].id).toBe(idea.id)
            expect(body[0].status).toBe('active')
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
            }, sessionHandler.user)

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

        it('should return not found for draft idea for anonymous user', async () => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            const idea = await createIdea({title: 'Test title', status: IdeaStatus.Draft}, otherUser)
            return request(app())
                .get(`${baseUrl}/${idea.id}`)
                .expect(404)
        })

        it('should return not found for draft idea of other user', async () => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            const idea = await createIdea({title: 'Test title', status: IdeaStatus.Draft}, otherUser)
            return sessionHandler.authorizeRequest(request(app())
                .get(`${baseUrl}/${idea.id}`))
                .expect(404)
        })

        it('should return active idea of other user', async () => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            const idea = await createIdea({title: 'Test title', status: IdeaStatus.Active}, otherUser)
            const result = await sessionHandler.authorizeRequest(request(app())
                .get(`${baseUrl}/${idea.id}`))
                .expect(200)

            expect(result.body.id).toBe(idea.id)
            expect(result.body.status).toBe('active')
        })

        it('should return draft idea of a logged in user', async () => {
            const idea = await createIdea({title: 'Test title', status: IdeaStatus.Draft}, sessionHandler.user)
            const result = await sessionHandler.authorizeRequest(request(app())
                .get(`${baseUrl}/${idea.id}`))
                .expect(200)

            expect(result.body.id).toBe(idea.id)
            expect(result.body.status).toBe('draft')
        })

        it('should return bad request for not valid uuid param', () => {
            return request(app())
                .get(`${baseUrl}/not_valid`)
                .expect(400)
        })
    })

    describe('POST', () => {
        it('should return created for minimal valid data', () => {
            return sessionHandler.authorizeRequest(request(app())
                . post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 3}]}))
                .expect(201)
        })

        it('should return bad request if no networks', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: null}))
                .expect(400)
        })

        it('should return bad request if empty networks', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: []}))
                .expect(400)
        })

        it('should return bad request if network without a value', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: null}]}))
                .expect(400)
        })

        it('should return bad request if network without a name', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: null, value: 5}]}))
                .expect(400)
        })

        it('should return bad request if network without a value', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: null}]}))
                .expect(400)
        })

        it('should return bad request if links are not array', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 2}], links: 'link'}))
                .expect(400)
        })

        it('should return bad request if links are strings array', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 2}], links: 'https://somelink.com'}))
                .expect(400)
        })

        it('should return bad request for empty title', () => {
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: '', networks: [{name: 'kusama', value: 2}]}))
                .expect(400)
        })

        it('should return bad request for wrong beneficiary', () => {
            const beneficiary = '5GrwvaEF5zXb26Fz9rcQpDW'
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({
                    title: 'Test title',
                    networks: [{name: 'kusama', value: 2}],
                    beneficiary
                }))
                .expect(400)
        })

        it('should return created for empty beneficiary', () => {
            const beneficiary = ''
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({
                    title: 'Test title',
                    networks: [{name: 'kusama', value: 2}],
                    beneficiary
                }))
                .expect(201)
        })

        it('should return created for correct beneficiary', () => {
            const beneficiary = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
            return sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({
                    title: 'Test title',
                    networks: [{name: 'kusama', value: 2}],
                    beneficiary
                }))
                .expect(201)
        })

        it('should return created for all valid data', () => {
            return sessionHandler.authorizeRequest(request(app())
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
                }))
                .expect(201)
        })

        it('should return created idea for valid data', async (done) => {
            const response = await sessionHandler.authorizeRequest(request(app())
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
                }))

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
            expect(body.ordinalNumber).toBeDefined()
            expect(body.status).toBe(DefaultIdeaStatus)
            done()
        })

        it('should create an idea and networks', async (done) => {
            const result = await sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 10}]}))

            const ideasService = app.get().get(IdeasService)
            const actual = await ideasService.findOne(result.body.id, sessionHandler.user)
            expect(actual).toBeDefined()
            expect(actual!.title).toBe('Test title')
            expect(actual!.networks!.length).toBe(1)
            expect(actual!.networks![0].name).toBe('kusama')
            expect(Number(actual!.networks![0].value)).toBe(10)
            done()
        })

        it('should return forbidden for not authorized request', () => {
            return request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 3}]})
                .expect(HttpStatus.FORBIDDEN)
        })

        it('should return forbidden for not verified user', async (done) => {
            const sessionHandlerNotVerified = await createUserSessionHandler(app(), 'not.verified@example.com', 'not-verified')
            await sessionHandlerNotVerified.authorizeRequest(request(app())
                .post(`${baseUrl}`)
                .send({title: 'Test title', networks: [{name: 'kusama', value: 3}]}))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })
    })

    describe('PATCH', () => {
        it('should return status ok for minimal patch data', async (done) => {
            const idea = await createIdea({title: 'Test title'}, sessionHandler.user)
            await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'}))
                .expect(200)
            done()
        })
        it('should return not found if wrong id', () => {
            return sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${uuid()}`)
                .send({title: 'Test title 2'}))
                .expect(404)
        })
        it('should patch title', async (done) => {
            const idea = await createIdea({title: 'Test title'}, sessionHandler.user)
            const response = await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'}))
                .expect(200)
            expect(response.body.title).toBe('Test title 2')
            done()
        })
        it('should patch network', async (done) => {
            const idea = await createIdea({title: 'Test title', networks: [{name: 'kusama', value: 13}]}, sessionHandler.user)
            const response = await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    networks: [
                        {
                            ...idea.networks[0],
                            value: 33
                        }
                    ]
                }))
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
            }, sessionHandler.user)
            const response = await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    links: ['patched link']
                }))
                .expect(200)
            expect(response.body.links[0]).toBe('patched link')
            done()
        })
        it('should return bad request if links are not array', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 13}],
                links: ['The link']
            }, sessionHandler.user)
            await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    links: 'Updated link'
                }))
                .expect(400)
            done()
        })
        it('should patch idea status', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 13}]
            }, sessionHandler.user)
            const response = await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    status: IdeaStatus.Active
                }))
                .expect(200)
            expect(response.body.status).toBe(IdeaStatus.Active)
            done()
        })
        it('should return bad request if idea status is unknown', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 13}]
            }, sessionHandler.user)
            await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({
                    status: 'unknown_idea_status'
                }))
                .expect(400)
            done()
        })
        it('should keep previous data for not patched properties', async (done) => {
            const idea = await createIdea({
                title: 'Test title',
                networks: [{name: 'kusama', value: 10}],
                beneficiary: 'abcd-1234',
                content: 'Test content'
            }, sessionHandler.user)
            const response = await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'}))
                .expect(200)
            const body = response.body
            expect(body.title).not.toBe('Test title')
            expect(body.beneficiary).toBe('abcd-1234')
            expect(body.content).toBe('Test content')
            expect(body.networks[0].name).toBe('kusama')
            done()
        })
        it('should not patch ordinal number', async (done) => {
            const idea = await createIdea({}, sessionHandler.user)
            const ordinalNumber = idea.ordinalNumber + 13
            const response = await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({ordinalNumber}))
                .expect(200)
            expect(response.body.ordinalNumber).not.toBe(ordinalNumber)
            done()
        })
        it('should not pass ordinal number to the service', async (done) => {
            const spyOnPatchIdea = jest.spyOn(getService(), 'update')
            const idea = await createIdea({}, sessionHandler.user)
            const ordinalNumber = idea.ordinalNumber + 13
            await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({ordinalNumber}))
                .expect(200)
            expect(spyOnPatchIdea).toHaveBeenCalledWith({}, idea.id, expect.objectContaining({
                user: expect.objectContaining({id : sessionHandler.user.user.id})
            }))
            done()
        })

        it('should return forbidden for not authorized request', async (done) => {
            const idea = await createIdea({title: 'Test title'}, sessionHandler.user)
            await request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'})
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for idea created by other user', async (done) => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            const idea = await createIdea({title: 'Test title'}, otherUser)
            await sessionHandler.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'}))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for not verified user', async (done) => {
            const sessionHandlerNotVerified = await createUserSessionHandler(app(), 'not.verified@example.com', 'not-verified')
            const idea = await createIdea({title: 'Test title'}, sessionHandlerNotVerified.user)
            await sessionHandlerNotVerified.authorizeRequest(request(app())
                .patch(`${baseUrl}/${idea.id}`)
                .send({title: 'Test title 2'}))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })
    })
    describe('DELETE', () => {
        it('should delete idea', async (done) => {
            const idea = await createIdea({title: 'Test title'}, sessionHandler.user)
            await sessionHandler.authorizeRequest(request(app())
                .delete(`${baseUrl}/${idea.id}`))
                .expect(200)
            await sessionHandler.authorizeRequest(request(app())
                .get(`${baseUrl}/${idea.id}`))
                .expect(404)
            done()
        })
        it('should delete idea with networks', async (done) => {
            const idea = await createIdea({title: 'Test title', networks: [{name: 'polkadot', value: 47}]}, sessionHandler.user)
            await sessionHandler.authorizeRequest(request(app())
                .delete(`${baseUrl}/${idea.id}`))
                .expect(200)
            await sessionHandler.authorizeRequest(request(app())
                .get(`${baseUrl}/${idea.id}`))
                .expect(404)
            done()
        })
        it('should return not found if wrong id', (done) => {
            sessionHandler.authorizeRequest(request(app())
                .delete(`${baseUrl}/${uuid()}`))
                .expect(404)
                .end(done)
        })

        it('should return forbidden for not authorized request', async (done) => {
            const idea = await createIdea({title: 'Test title'}, sessionHandler.user)
            await request(app())
                .delete(`${baseUrl}/${idea.id}`)
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for not verified user', async (done) => {
            const sessionHandlerNotVerified = await createUserSessionHandler(app(), 'not.verified@example.com', 'not-verified')
            const idea = await createIdea({title: 'Test title'}, sessionHandlerNotVerified.user)
            await sessionHandlerNotVerified.authorizeRequest(request(app())
                .delete(`${baseUrl}/${idea.id}`))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })

        it('should return forbidden for idea created by other user', async (done) => {
            const otherUser = await createSessionUser({username: 'otherUser', email: 'otherEmail'})
            const idea = await createIdea({title: 'Test title'}, otherUser)
            await sessionHandler.authorizeRequest(request(app())
                .delete(`${baseUrl}/${idea.id}`))
                .expect(HttpStatus.FORBIDDEN)
            done()
        })
    })
})
