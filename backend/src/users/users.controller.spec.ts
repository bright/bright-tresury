import { UsersService } from './users.service'
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers'
import { v4 as uuid } from 'uuid'
import { HttpStatus } from '@nestjs/common'
import { createUserSessionHandlerWithVerifiedEmail } from '../auth/supertokens/specHelpers/supertokens.session.spec.helper'
import { createSessionData } from '../ideas/spec.helpers'
import { cleanAuthorizationDatabase } from '../auth/supertokens/specHelpers/supertokens.database.spec.helper'

describe('DELETE', () => {
    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const app = beforeSetupFullApp()
    const usersService = () => app.get().get(UsersService)

    it(`should return ${HttpStatus.OK} when deletes user`, async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const getBaseUrl = (userId: string) => `/api/v1/users/${userId}/`
        return sessionHandler
            .authorizeRequest(request(app()).delete(`${getBaseUrl(sessionHandler.sessionData.user.id)}`))
            .expect(HttpStatus.OK)
    })

    it(`should return ${HttpStatus.FORBIDDEN} when user trying to delete another user`, async () => {
        const sessionHandler = await createUserSessionHandlerWithVerifiedEmail(app())
        const { user: otherUser } = await createSessionData({ username: 'other', email: 'other@example.com' })
        const getBaseUrl = (otherUserId: string) => `/api/v1/users/${otherUserId}/`
        return sessionHandler
            .authorizeRequest(request(app()).delete(`${getBaseUrl(otherUser.id)}`))
            .expect(HttpStatus.FORBIDDEN)
    })

    it(`should return ${HttpStatus.FORBIDDEN} when trying to delete user when user is not authorized`, async () => {
        const user = await usersService().create({
            authId: uuid(),
            username: 'Chuck',
            email: 'chuck@email.com',
        })
        const baseUrl = '/api/v1/users'

        request(app()).delete(`${baseUrl}/${user.id}`).expect(HttpStatus.FORBIDDEN)
    })
})
