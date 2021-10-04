import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeAllSetup, beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { createAppEvent } from '../spec.helpers'
import { AppEventNotificationsService } from './app-event-notifications.service'
import { EmailNotificationsService } from './email-notifications/email-notifications.service'

describe('AppEventNotificationsService', () => {
    const app = beforeSetupFullApp()

    const service = beforeAllSetup(() => app().get<AppEventNotificationsService>(AppEventNotificationsService))

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('notify', () => {
        it('should call send function of EmailNotificationsService', async () => {
            const { user } = await createSessionData({ email: 'agnieszka.olszewska@brightinventions.pl' })
            const appEvent = createAppEvent([user.id])

            const spy = jest.spyOn(app().get<EmailNotificationsService>(EmailNotificationsService), 'send')

            await service().notify(appEvent)

            expect(spy).toHaveBeenCalledWith(expect.objectContaining(appEvent))
        })
    })
})
