import { InsertEvent } from 'typeorm'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers'
import { AppEventEntity } from './entities/app-event.entity'
import { createAndSaveAppEvent } from './spec.helpers'
import { AppEventSubscriber } from './subscribers/app-event.subscriber'

describe('AppEventsController E2E', () => {
    const app = beforeSetupFullApp()
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

    it('Should get and read app events', async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const event = await createAndSaveAppEvent([sessionHandler.sessionData.user.id])

        const get = await sessionHandler.authorizeRequest(
            request(app())
                .get(`/api/v1/users/${sessionHandler.sessionData.user.id}/app-events?isRead=false`)
                .expect(200),
        )

        expect(get.body.total).toBe(1)

        await sessionHandler
            .authorizeRequest(
                request(app())
                    .patch(`/api/v1/users/${sessionHandler.sessionData.user.id}/app-events/read`)
                    .send({ appEventIds: [event.id] }),
            )
            .expect(200)

        const getAfterRead = await sessionHandler.authorizeRequest(
            request(app())
                .get(`/api/v1/users/${sessionHandler.sessionData.user.id}/app-events?isRead=false`)
                .expect(200),
        )

        expect(getAfterRead.body.total).toBe(0)
    })
})
