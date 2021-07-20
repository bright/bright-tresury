import { HttpStatus } from '@nestjs/common'
import { v4 as uuid, validate as uuidValidate } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../../utils/spec.helpers'
import { Idea } from '../entities/idea.entity'
import { IdeasService } from '../ideas.service'
import { IdeaStatus } from '../idea-status'
import { createIdea, createIdeaMilestone, createSessionData } from '../spec.helpers'
import { CreateIdeaMilestoneDto } from './dto/create-idea-milestone.dto'
import { IdeaMilestoneDto } from './dto/idea-milestone.dto'
import { IdeaMilestone } from './entities/idea-milestone.entity'
import { IdeaMilestonesService } from './idea-milestones.service'

const baseUrl = (ideaId: string) => `/api/v1/ideas/${ideaId}/milestones`

describe('/api/v1/ideas/:ideaId/milestones', () => {
    const app = beforeSetupFullApp()
    const getIdeasService = () => app.get().get(IdeasService)
    const getIdeaMilestonesService = () => app.get().get(IdeaMilestonesService)

    let idea: Idea
    let sessionHandler: SessionHandler

    const milestoneDto = new CreateIdeaMilestoneDto(
        'subject',
        [{ name: NETWORKS.POLKADOT, value: 100 }],
        null,
        null,
        null,
        null,
    )

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        idea = await createIdea({ details: { title: 'ideaTitle' } }, sessionHandler.sessionData, getIdeasService())
    })

    describe('GET', () => {
        it(`should return ${HttpStatus.OK} for the existing idea`, async () => {
            return request(app()).get(baseUrl(idea.id)).expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.NOT_FOUND} for not existing idea`, async () => {
            const notExistingIdeaUuid = uuid()

            return request(app()).get(baseUrl(notExistingIdeaUuid)).expect(HttpStatus.NOT_FOUND)
        })

        it('should return empty array for idea without milestones', async () => {
            const result = await request(app()).get(baseUrl(idea.id))

            const body = result.body as IdeaMilestoneDto[]

            expect(body.length).toBe(0)
        })

        it('should return idea milestones', async () => {
            await createIdeaMilestone(
                idea.id,
                new CreateIdeaMilestoneDto('ideaMilestoneSubject', [], null, null, null, null),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )

            const result = await request(app()).get(baseUrl(idea.id))

            const body = result.body as IdeaMilestoneDto[]

            expect(body.length).toBe(1)
            expect(body[0].subject).toBe('ideaMilestoneSubject')
        })

        it('should return milestones only of the given idea', async () => {
            await createIdeaMilestone(
                idea.id,
                new CreateIdeaMilestoneDto('ideaMilestoneSubject', [], null, null, null, null),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )

            const anotherIdea = await createIdea({}, sessionHandler.sessionData, getIdeasService())
            await createIdeaMilestone(
                anotherIdea.id,
                new CreateIdeaMilestoneDto('anotherIdeaMilestoneSubject', [], null, null, null, null),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )

            const result = await request(app()).get(baseUrl(idea.id))

            const body = result.body as IdeaMilestoneDto[]

            expect(body.length).toBe(1)
            expect(body[0].subject).toBe('ideaMilestoneSubject')
        })

        it('should return milestones containing correct data', async () => {
            await createIdeaMilestone(
                idea.id,
                new CreateIdeaMilestoneDto(
                    'ideaMilestoneSubject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    new Date(2021, 3, 20),
                    new Date(2021, 3, 21),
                    'ideaMilestoneDescription',
                ),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )

            const result = await request(app()).get(baseUrl(idea.id))

            const body = result.body as IdeaMilestoneDto[]

            expect(body.length).toBe(1)
            expect(body[0].subject).toBe('ideaMilestoneSubject')
            expect(body[0].networks.length).toBe(1)
            expect(body[0].networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(body[0].networks[0].value).toBe(100)
            expect(body[0].beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body[0].dateFrom).toBe('2021-04-20')
            expect(body[0].dateTo).toBe('2021-04-21')
            expect(body[0].description).toBe('ideaMilestoneDescription')
        })

        it('should return milestones of a draft idea of a logged in user', async () => {
            const draftIdea = await createIdea(
                {networks: [{ name: NETWORKS.POLKADOT, value: 100 }], status: IdeaStatus.Draft },
                sessionHandler.sessionData,
            )
            await getIdeaMilestonesService().create(draftIdea.id, milestoneDto, sessionHandler.sessionData)
            const result = await sessionHandler.authorizeRequest(request(app()).get(baseUrl(draftIdea.id)))

            expect(result.body.length).toBe(1)

            const body = result.body as IdeaMilestone[]
            expect(body[0].subject).toBe(milestoneDto.subject)
        })

        it('should return not found for a draft idea of other users', async () => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const draftIdea = await createIdea(
            { networks: [{ name: NETWORKS.POLKADOT, value: 100 }], status: IdeaStatus.Draft },
                otherUser
            )
            await getIdeaMilestonesService().create(draftIdea.id, milestoneDto, otherUser)
            await sessionHandler
                .authorizeRequest(request(app()).get(baseUrl(draftIdea.id)))
                .expect(HttpStatus.NOT_FOUND)
        })
    })

    describe('GET /:ideaMilestoneId', () => {
        it(`should return ${HttpStatus.OK} for existing idea milestone`, async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                new CreateIdeaMilestoneDto(
                    'subject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    null,
                    null,
                    null,
                    null,
                ),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )
            return request(app())
                .get(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                .expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.NOT_FOUND} for not existing idea milestone`, () => {
            return request(app())
                .get(`${baseUrl(idea.id)}/${uuid()}`)
                .expect(HttpStatus.NOT_FOUND)
        })

        it('should return idea milestone with all correct data', async () => {
            const ideaMilestone = await createIdeaMilestone(
                idea.id,
                new CreateIdeaMilestoneDto(
                    'subject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    new Date(2021, 5, 20),
                    new Date(2021, 5, 21),
                    'description',
                ),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )

            const result = await request(app()).get(`${baseUrl(idea.id)}/${ideaMilestone.id}`)

            const body = result.body as IdeaMilestoneDto

            expect(body.subject).toBe('subject')
            expect(body.networks.length).toBe(1)
            expect(body.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(body.networks[0].value).toBe(100)
            expect(body.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.dateFrom).toBe('2021-06-20')
            expect(body.dateTo).toBe('2021-06-21')
            expect(body.description).toBe('description')
        })

        it(`should return ${HttpStatus.NOT_FOUND} for idea milestone which belongs to idea with ${IdeaStatus.Draft} status for anonymous user`, async () => {
            const ideaWithDraftStatus = await createIdea(
                {
                    status: IdeaStatus.Draft,
                },
                sessionHandler.sessionData,
                getIdeasService(),
            )
            const ideaMilestone = await createIdeaMilestone(
                ideaWithDraftStatus.id,
                new CreateIdeaMilestoneDto(
                    'subject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    null,
                    null,
                    null,
                    null,
                ),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )
            return request(app())
                .get(`${baseUrl(ideaWithDraftStatus.id)}/${ideaMilestone.id}`)
                .expect(HttpStatus.NOT_FOUND)
        })

        it(`should return ${HttpStatus.NOT_FOUND} for idea milestone which belongs to idea with ${IdeaStatus.Draft} status for not owner`, async () => {
            const otherUser = await createSessionData({
                username: 'other',
                email: 'other@example.com',
            })
            const ideaWithDraftStatus = await createIdea(
                {
                    status: IdeaStatus.Draft,
                },
                otherUser,
                getIdeasService(),
            )
            const ideaMilestone = await createIdeaMilestone(
                ideaWithDraftStatus.id,
                new CreateIdeaMilestoneDto(
                    'subject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    null,
                    null,
                    null,
                    null,
                ),
                otherUser,
                getIdeaMilestonesService(),
            )

            return sessionHandler
                .authorizeRequest(request(app()).get(`${baseUrl(ideaWithDraftStatus.id)}/${ideaMilestone.id}`))
                .expect(HttpStatus.NOT_FOUND)
        })

        it(`should return idea milestone which belongs to idea with ${IdeaStatus.Draft} status for owner`, async () => {
            const ideaWithDraftStatus = await createIdea(
                {
                    status: IdeaStatus.Draft,
                },
                sessionHandler.sessionData,
                getIdeasService(),
            )
            const ideaMilestone = await createIdeaMilestone(
                ideaWithDraftStatus.id,
                new CreateIdeaMilestoneDto(
                    'subject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    null,
                    null,
                    null,
                    null,
                ),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )

            const result = await sessionHandler.authorizeRequest(
                request(app()).get(`${baseUrl(ideaWithDraftStatus.id)}/${ideaMilestone.id}`),
            )

            const body = result.body as IdeaMilestoneDto

            expect(body.id).toBe(ideaMilestone.id)
        })

        it(`should return idea milestone which belongs to idea with ${IdeaStatus.Active} status for not owner`, async () => {
            const otherUser = await createSessionData({
                username: 'other',
                email: 'other@example.com',
            })
            const ideaWithActiveStatus = await createIdea(
                {
                    status: IdeaStatus.Active,
                },
                otherUser,
                getIdeasService(),
            )
            const ideaMilestone = await createIdeaMilestone(
                ideaWithActiveStatus.id,
                new CreateIdeaMilestoneDto(
                    'subject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    null,
                    null,
                    null,
                    null,
                ),
                otherUser,
                getIdeaMilestonesService(),
            )

            const result = await request(app()).get(`${baseUrl(ideaWithActiveStatus.id)}/${ideaMilestone.id}`)

            const body = result.body as IdeaMilestoneDto

            expect(body.id).toBe(ideaMilestone.id)
        })
    })

    describe('POST', () => {
        it(`should return ${HttpStatus.BAD_REQUEST} if subject is not given`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if subject is null`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: null,
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if subject is empty`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: '',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if networks are not given`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl(idea.id)).send({
                        subject: 'ideaMilestoneSubject',
                        dateFrom: null,
                        dateTo: null,
                        description: null,
                    }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if networks are empty array`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app()).post(baseUrl(idea.id)).send({
                        subject: 'ideaMilestoneSubject',
                        networks: [],
                        dateFrom: null,
                        dateTo: null,
                        description: null,
                    }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network name is not given`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ value: 10 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network name is null`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: null, value: 10 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network value is not given`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network value is null`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: null }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network value is not a number`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 'value' }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if network value is less than zero`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: -1 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if beneficiary is incorrect`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 'value' }],
                            beneficiary: '5GrwvaEF5z',
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if dateFrom is given but has incorrect format`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                            dateFrom: 'incorrect_format',
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} if dateTo is given but has incorrect format`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 100 }],
                            dateFrom: null,
                            dateTo: 'incorrect_format',
                            description: null,
                        }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.CREATED} if the minimal required data is given`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                            dateFrom: null,
                            dateTo: null,
                            description: null,
                        }),
                )
                .expect(HttpStatus.CREATED)
        })

        it(`should return ${HttpStatus.CREATED} if all correct data is given`, () => {
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                            beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                            dateFrom: '2021-04-20',
                            dateTo: '2021-04-21',
                            description: 'ideaDescription',
                        }),
                )
                .expect(HttpStatus.CREATED)
        })

        it(`should return created idea milestone if all correct data is given`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                            beneficiary: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                            dateFrom: '2021-04-20',
                            dateTo: '2021-04-21',
                            description: 'ideaDescription',
                        }),
                )
                .expect(HttpStatus.CREATED)

            const body = response.body as IdeaMilestoneDto

            expect(uuidValidate(body.id)).toBe(true)
            expect(body.ordinalNumber).toBeDefined()
            expect(body.subject).toBe('ideaMilestoneSubject')
            expect(body.networks.length).toBe(1)
            expect(body.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(body.networks[0].value).toBe(10)
            expect(body.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.dateFrom).toBe('2021-04-20')
            expect(body.dateTo).toBe('2021-04-21')
            expect(body.description).toBe('ideaDescription')
        })

        it('should return forbidden for an idea of other users', async () => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const otherIdea = await createIdea(
                { networks: [{ name: NETWORKS.POLKADOT, value: 100 }] },
                otherUser,
            )
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(otherIdea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                        }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })

        it('should return forbidden for not authorized user', async () => {
            await request(app())
                .post(baseUrl(idea.id))
                .send({
                    subject: 'ideaMilestoneSubject',
                    networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                })
                .expect(HttpStatus.FORBIDDEN)
        })

        it('should return forbidden for not verified user', async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            await notVerifiedSessionHandler
                .authorizeRequest(
                    request(app())
                        .post(baseUrl(idea.id))
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                        }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('PATCH', () => {
        let ideaMilestone: IdeaMilestone

        beforeEach(async () => {
            ideaMilestone = await createIdeaMilestone(
                idea.id,
                new CreateIdeaMilestoneDto(
                    'ideaMilestoneSubject',
                    [{ name: NETWORKS.POLKADOT, value: 100 }],
                    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                    new Date(2021, 3, 20),
                    new Date(2021, 3, 21),
                    'ideaMilestoneDescription',
                ),
                sessionHandler.sessionData,
                getIdeaMilestonesService(),
            )
        })

        it(`should return ${HttpStatus.NOT_FOUND} if incorrect idea milestone id is given`, () => {
            const incorrectIdeaMilestoneId = uuid()

            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${incorrectIdeaMilestoneId}`)
                        .send({}),
                )
                .expect(HttpStatus.NOT_FOUND)
        })

        it(`should patch subject correctly`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            subject: 'notEmptySubject',
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.subject).toBe('notEmptySubject')
        })

        it(`should patch networks correctly`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            networks: [
                                {
                                    ...ideaMilestone.networks[0],
                                    value: 500,
                                },
                            ],
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.networks).toBeDefined()
            expect(body.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(body.networks[0].value).toBe(500)
        })

        it(`should patch beneficiary correctly`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            beneficiary: '15Vn4KyqUhE1YtSNsZ8E6pAMSjbYVdz6MR4L2971Zs7ju9ZT',
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.beneficiary).toBe('15Vn4KyqUhE1YtSNsZ8E6pAMSjbYVdz6MR4L2971Zs7ju9ZT')
        })

        it(`should patch dateFrom correctly`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            dateFrom: '2021-04-19',
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.dateFrom).toBe('2021-04-19')
        })

        it(`should patch dateTo correctly`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            dateTo: '2021-04-22',
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.dateTo).toBe('2021-04-22')
        })

        it(`should patch description correctly`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            description: 'newDescription',
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.description).toBe('newDescription')
        })

        it(`should not change data which was not patched`, async () => {
            const response = await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            subject: 'newSubject',
                        }),
                )
                .expect(HttpStatus.OK)

            const body = response.body as IdeaMilestoneDto

            expect(body.ordinalNumber).toBe(ideaMilestone.ordinalNumber)
            expect(body.subject).toBe('newSubject')
            expect(body.networks.length).toBe(1)
            expect(body.networks[0].name).toBe(NETWORKS.POLKADOT)
            expect(body.networks[0].value).toBe(100)
            expect(body.beneficiary).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
            expect(body.dateFrom).toBe('2021-04-20')
            expect(body.dateTo).toBe('2021-04-21')
            expect(body.description).toBe('ideaMilestoneDescription')
        })

        it('should return forbidden for an idea of other users', async () => {
            const otherUser = await createSessionData({ username: 'otherUser', email: 'otherEmail' })
            const draftIdea = await createIdea(
            { networks: [{ name: NETWORKS.POLKADOT, value: 100 }], status: IdeaStatus.Draft },
                otherUser,
            )
            const milestone = await createIdeaMilestone(draftIdea.id, milestoneDto, otherUser)
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(draftIdea.id)}/${milestone.id}`)
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                        }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })

        it('should return bad request for not authorized user', async () => {
            await request(app())
                .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                .send({
                    subject: 'ideaMilestoneSubject',
                    networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                })
                .expect(HttpStatus.FORBIDDEN)
        })

        it('should return bad request for not verified user', async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            await notVerifiedSessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${baseUrl(idea.id)}/${ideaMilestone.id}`)
                        .send({
                            subject: 'ideaMilestoneSubject',
                            networks: [{ name: NETWORKS.POLKADOT, value: 10 }],
                        }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
