import { HttpStatus } from '@nestjs/common'
import { InsertEvent } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
} from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { createSessionData } from '../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { AppEventsService } from './app-events.service'
import { AppEventType } from './entities/app-event-type'
import { AppEventEntity } from './entities/app-event.entity'
import { createAndSaveAppEvent } from './spec.helpers'
import { AppEventSubscriber } from './subscribers/app-event.subscriber'

const getBaseUrl = (userId: string) => `/api/v1/users/${userId}/app-events`

describe('/api/v1/users/:userId/app-events/', () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get<AppEventsService>(AppEventsService)
    const appEventSubscriber = beforeAllSetup(() => app().get<AppEventSubscriber>(AppEventSubscriber))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
        jest.spyOn(appEventSubscriber(), 'afterInsert').mockImplementationOnce(
            (event: InsertEvent<AppEventEntity>): Promise<void> => {
                return Promise.resolve()
            },
        )
        jest.clearAllMocks()
    })

    describe('GET', () => {
        it('should return status code 200 for minimal valid data', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler.authorizeRequest(
                request(app()).get(getBaseUrl(sessionHandler.sessionData.user.id)).expect(200),
            )
        })

        it('should return data', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const event = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).get(getBaseUrl(sessionHandler.sessionData.user.id)),
            )
            expect(body.items[0].id).toBe(event.id)
            expect(body.items[0].isRead).toBe(false)
            expect(body.items[0].data).toStrictEqual(event.data)
        })

        it('should call findAll function from AppEventsService with basic valid params', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const spy = jest.spyOn(getService(), 'findAll')
            await sessionHandler.authorizeRequest(
                request(app()).get(
                    `${getBaseUrl(
                        sessionHandler.sessionData.user.id,
                    )}?isRead=true&appEventType[]=new_idea_comment&pageSize=10&pageNumber=2`,
                ),
            )

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: sessionHandler.sessionData.user.id,
                    isRead: true,
                    appEventType: [AppEventType.NewIdeaComment],
                }),
                { pageSize: 10, pageNumber: 2 },
            )
        })

        it('should call findAll function from AppEventsService with minimal valid params', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const spy = jest.spyOn(getService(), 'findAll')

            await sessionHandler.authorizeRequest(
                request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?`),
            )
            expect(spy).toHaveBeenCalledWith(
                {
                    userId: sessionHandler.sessionData.user.id,
                    isRead: undefined,
                    appEventType: undefined,
                    ideaId: undefined,
                    proposalIndex: undefined,
                    networkId: undefined,
                },
                expect.anything(),
            )
        })

        it('should filter by AppEventType', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const event = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])

            const result = await sessionHandler.authorizeRequest(
                request(app()).get(
                    `${getBaseUrl(sessionHandler.sessionData.user.id)}?appEventType[]=${event.data.type}`,
                ),
            )

            expect(result.body.items).toHaveLength(1)
            expect(result.body.items[0]).toMatchObject({
                id: event.id,
            })
        })

        it('should filter by AppEventType when there are two appEvents', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const event1 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            const event2 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])

            const result = await sessionHandler.authorizeRequest(
                request(app()).get(
                    `${getBaseUrl(sessionHandler.sessionData.user.id)}?appEventType[]=${
                        AppEventType.NewIdeaComment
                    }&appEventType[]=${AppEventType.TaggedInIdeaComment}`,
                ),
            )

            expect(result.body.items).toHaveLength(2)
            expect(result.body.items[0]).toMatchObject({
                id: event2.id,
            })
            expect(result.body.items[1]).toMatchObject({
                id: event1.id,
            })
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not boolean isRead param`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?isRead=not_boolean_value`),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not valid AppEventType param`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).get(
                        `${getBaseUrl(sessionHandler.sessionData.user.id)}?appEventType[]=not_valid_type`,
                    ),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} when trying to access other user's data`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
            return sessionHandler
                .authorizeRequest(request(app()).get(`${getBaseUrl(otherUser.id)}`))
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app()).get(getBaseUrl(uuid())).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            return notVerifiedSessionHandler
                .authorizeRequest(request(app()).get(getBaseUrl(uuid())))
                .expect(HttpStatus.FORBIDDEN)
        })

        describe('idea app events', () => {
            it('should call findAll function with params for idea app events', async () => {
                const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
                const spy = jest.spyOn(getService(), 'findAll')

                const ideaId = uuid()
                await sessionHandler.authorizeRequest(
                    request(app()).get(
                        `${getBaseUrl(
                            sessionHandler.sessionData.user.id,
                        )}?appEventType[]=new_idea_comment&ideaId=${ideaId}`,
                    ),
                )
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        userId: sessionHandler.sessionData.user.id,
                        appEventType: [AppEventType.NewIdeaComment],
                        ideaId,
                    }),
                    expect.anything(),
                )
            })

            it(`should return ${HttpStatus.BAD_REQUEST} for not uuid ideaId param`, async () => {
                const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
                return sessionHandler
                    .authorizeRequest(
                        request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?ideaId=not_uuid`),
                    )
                    .expect(HttpStatus.BAD_REQUEST)
            })
        })

        describe('proposal app events', () => {
            it('should call findAll function with all valid params for proposal app events', async () => {
                const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
                const spy = jest.spyOn(getService(), 'findAll')

                await sessionHandler.authorizeRequest(
                    request(app()).get(
                        `${getBaseUrl(
                            sessionHandler.sessionData.user.id,
                        )}?appEventType[]=new_idea_comment&proposalIndex=3&networkId=${NETWORKS.POLKADOT}`,
                    ),
                )
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        userId: sessionHandler.sessionData.user.id,
                        appEventType: [AppEventType.NewIdeaComment],
                        proposalIndex: 3,
                        networkId: NETWORKS.POLKADOT,
                    }),
                    expect.anything(),
                )
            })

            it(`should return ${HttpStatus.BAD_REQUEST} for not number proposalIndex param`, async () => {
                const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
                return sessionHandler
                    .authorizeRequest(
                        request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?proposalIndex=three`),
                    )
                    .expect(HttpStatus.BAD_REQUEST)
            })

            it(`should return ${HttpStatus.BAD_REQUEST} for not valid networkId param`, async () => {
                const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
                return sessionHandler
                    .authorizeRequest(
                        request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?networkId=not_valid`),
                    )
                    .expect(HttpStatus.BAD_REQUEST)
            })
        })

        // PAGINATED FIXME - extract to some helper as assert function to be able to use with other requests
        it('should return paginated data ordered descending by creation date time', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const event1 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            const event2 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            const event3 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).get(getBaseUrl(sessionHandler.sessionData.user.id)).expect(200),
            )
            expect(body.total).toBe(3)
            expect(body.items).toHaveLength(3)
            expect(body.items[0].id).toBe(event3.id)
            expect(body.items[1].id).toBe(event2.id)
            expect(body.items[2].id).toBe(event1.id)
        })

        it('should return empty paginated data', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const { body } = await sessionHandler.authorizeRequest(
                request(app()).get(getBaseUrl(sessionHandler.sessionData.user.id)).expect(200),
            )
            expect(body.total).toBe(0)
            expect(body.items).toHaveLength(0)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not number pageSize param`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?pageSize=not_number`),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not number pageNumber param`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler
                .authorizeRequest(
                    request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}?pageNumber=not_number`),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })
    })

    describe('/read PATCH', () => {
        it('should return status code 200', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const event1 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}/read`)
                        .send({ appEventIds: [event1.id] }),
                )
                .expect(200)
        })

        it('should call markAsRead function from AppEventsService', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const event1 = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])
            const spy = jest.spyOn(getService(), 'markAsRead')

            await sessionHandler.authorizeRequest(
                request(app())
                    .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}/read`)
                    .send({ appEventIds: [event1.id] }),
            )
            expect(spy).toHaveBeenCalledWith(sessionHandler.sessionData.user.id, [event1.id])
        })

        it('should call markAsRead function from AppEventsService for empty appEventIds table', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const spy = jest.spyOn(getService(), 'markAsRead')

            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}/read`)
                        .send({ appEventIds: [] }),
                )
                .expect(200)

            expect(spy).toHaveBeenCalledWith(sessionHandler.sessionData.user.id, [])
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for no appEventIds param`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}/read`)
                        .send({}),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} when trying to access other user's data`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(otherUser.id)}/read`)
                        .send({ appEventIds: [] }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .patch(`${getBaseUrl(uuid())}/read`)
                .send({ appEventIds: [] })
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            return notVerifiedSessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(uuid())}/read`)
                        .send({ appEventIds: [] }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
