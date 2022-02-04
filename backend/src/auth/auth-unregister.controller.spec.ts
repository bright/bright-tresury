import { HttpStatus } from '@nestjs/common'
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers'
import { cleanAuthorizationDatabase } from './supertokens/specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandlerWithVerifiedEmail } from './supertokens/specHelpers/supertokens.session.spec.helper'

describe(`Auth Controller`, () => {
    const app = beforeSetupFullApp()

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('unregister', () => {
        const baseUrl = '/api/v1/auth/unregister'
        it(`should return ${HttpStatus.OK} when deletes user`, async () => {
            const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
            return sessionHandler.authorizeRequest(request(app()).delete(baseUrl)).expect(HttpStatus.OK)
        })

        it(`should return ${HttpStatus.FORBIDDEN} when trying to delete user when user is not authorized`, async () => {
            return request(app()).delete(baseUrl).expect(HttpStatus.FORBIDDEN)
        })

        it(`should return ${HttpStatus.FORBIDDEN} when trying to delete user when user has not verified email`, async () => {
            // TODO should be possible to remove unverified account - task TREAS-383
            // return request(app()).delete(baseUrl).expect(HttpStatus.OK)
            return request(app()).delete(baseUrl).expect(HttpStatus.FORBIDDEN)
        })
    })
})
