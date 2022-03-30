import { HttpStatus } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { cleanAuthorizationDatabase } from '../../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import {
    createUserSessionHandler,
    createUserSessionHandlerWithVerifiedEmail,
    createWeb3SessionHandler,
} from '../../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { SuperTokensService } from '../../auth/supertokens/supertokens.service'
import { createSessionData } from '../../ideas/spec.helpers'
import { beforeSetupFullApp, cleanDatabase, request } from '../../utils/spec.helpers'
import { UserSettingsService } from './user-settings.service'

const getBaseUrl = (userId: string) => `/api/v1/users/${userId}/settings`

describe('/api/v1/users/:userId/settings', () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get<UserSettingsService>(UserSettingsService)
    const getSuperTokensService = () => app.get().get<SuperTokensService>(SuperTokensService)

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('GET', () => {
        it('should return status code 200', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler
                .authorizeRequest(request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}`))
                .expect(200)
        })

        it("should return user's settings", async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())

            const { body } = await sessionHandler.authorizeRequest(
                request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}`),
            )
            expect(body.isEmailNotificationEnabled).toBe(true)
            expect(body.username).toBe(sessionHandler.sessionData.user.username)
        })

        it('should not return username when web3 address only account', async () => {
            const sessionHandler = await createWeb3SessionHandler(app())

            const { body } = await sessionHandler.authorizeRequest(
                request(app()).get(`${getBaseUrl(sessionHandler.sessionData.user.id)}`),
            )
            expect(body.isEmailNotificationEnabled).toBe(true)
            expect(body.username).toBeUndefined()
        })

        it(`should return ${HttpStatus.FORBIDDEN} when trying to access other user's data`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
            return sessionHandler
                .authorizeRequest(request(app()).get(`${getBaseUrl(otherUser.id)}`))
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .get(`${getBaseUrl(uuid())}`)
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            return notVerifiedSessionHandler
                .authorizeRequest(request(app()).get(`${getBaseUrl(notVerifiedSessionHandler.sessionData.user.id)}`))
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('PATCH', () => {
        it('should return status code 200 for minimal valid data', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}`)
                        .send({}),
                )
                .expect(200)
        })

        it('should call update function from UsersService', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const spy = jest.spyOn(getService(), 'update')

            await sessionHandler.authorizeRequest(
                request(app())
                    .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}`)
                    .send({ isEmailNotificationEnabled: true, username: 'new-username' }),
            )
            expect(spy).toHaveBeenCalledWith(sessionHandler.sessionData.user.id, {
                isEmailNotificationEnabled: true,
                username: 'new-username',
            })
        })

        it('should update username in session', async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const spy = jest.spyOn(getSuperTokensService(), 'refreshAccessTokenPayloadForUser')

            await sessionHandler.authorizeRequest(
                request(app())
                    .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}`)
                    .send({ username: 'new-username' }),
            )
            expect(spy).toHaveBeenCalledWith(sessionHandler.sessionData.user.authId)
        })

        it(`should return ${HttpStatus.BAD_REQUEST} for not boolean isEmailNotificationEnabled param`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(sessionHandler.sessionData.user.id)}`)
                        .send({ isEmailNotificationEnabled: 'true' }),
                )
                .expect(HttpStatus.BAD_REQUEST)
        })

        it(`should return ${HttpStatus.FORBIDDEN} when trying to access other user's data`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
            return sessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(otherUser.id)}`)
                        .send({ isEmailNotificationEnabled: 'true' }),
                )
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not authorized request`, async () => {
            return request(app())
                .patch(`${getBaseUrl(uuid())}`)
                .send({})
                .expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} for not verified user`, async () => {
            const notVerifiedSessionHandler = await createUserSessionHandler(app(), 'other@example.com', 'other')
            return notVerifiedSessionHandler
                .authorizeRequest(
                    request(app())
                        .patch(`${getBaseUrl(notVerifiedSessionHandler.sessionData.user.id)}`)
                        .send({}),
                )
                .expect(HttpStatus.FORBIDDEN)
        })
    })
})
