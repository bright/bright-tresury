import { beforeSetupFullApp, cleanDatabase, NETWORKS, request } from '../utils/spec.helpers'
import { HttpStatus } from '@nestjs/common'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'
import { EmailsService } from '../emails/emails.service'
import { UserStatisticsService } from './user-statistics.service'

const baseUrl = (userId: string) => `/api/v1/users/${userId}/statistics`

describe(`/users/:userId/statistics`, () => {
    const app = beforeSetupFullApp()
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })
    describe('GET /?network=networkName', () => {
        it(`should return ${HttpStatus.OK} for given network name and authorized user`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler.authorizeRequest(
                request(app())
                    .get(`${baseUrl(sessionHandler.sessionData.user.id)}?network=${NETWORKS.POLKADOT}`)
                    .expect(200),
            )
        })
        it(`should return ${HttpStatus.BAD_REQUEST}, for not valid network`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler.authorizeRequest(
                request(app())
                    .get(`${baseUrl(sessionHandler.sessionData.user.id)}?network=not-valid-network`)
                    .expect(HttpStatus.BAD_REQUEST),
            )
        })
        it(`should return ${HttpStatus.FORBIDDEN}, for not authorized request`, async () => {
            return request(app())
                .get(`${baseUrl('6efe1d8d-f463-4a87-a482-3eade8f9af95')}?network=not-valid-network`)
                .expect(HttpStatus.FORBIDDEN)
        })
        it(`should return ${HttpStatus.FORBIDDEN}, for authorized user asking for other user stats`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler.authorizeRequest(
                request(app())
                    .get(`${baseUrl('6efe1d8d-f463-4a87-a482-3eade8f9af95')}?network=not-valid-network`)
                    .expect(HttpStatus.FORBIDDEN),
            )
        })
        it('should call UserStatisticsService.getUserStatistics method', async () => {
            const spy = jest.spyOn(app().get<UserStatisticsService>(UserStatisticsService), 'getUserStatistics')
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            await sessionHandler.authorizeRequest(
                request(app())
                    .get(`${baseUrl(sessionHandler.sessionData.user.id)}?network=${NETWORKS.POLKADOT}`)
                    .expect(200),
            )
            expect(spy).toHaveBeenCalledWith(NETWORKS.POLKADOT, sessionHandler.sessionData.user.id)
        })
    })
})
