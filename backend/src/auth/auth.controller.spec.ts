import { v4 as uuid } from 'uuid'
import { beforeSetupFullApp, cleanDatabase, request } from '../utils/spec.helpers'
import { MockSessionGuard } from './guards/session.spec.guard'
import { HttpStatus } from '@nestjs/common'
import { MockSessionResolver } from './session/session.spec.resolver'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { cleanAuthorizationDatabase } from './supertokens/specHelpers/supertokens.database.spec.helper'
import {
    replaceSessionGuard,
    replaceSessionResolver,
} from './supertokens/specHelpers/supertokens.providers.spec.helper'

describe(`Auth Controller`, () => {
    const sessionGuard = new MockSessionGuard()
    const sessionResolver = new MockSessionResolver()

    const app = beforeSetupFullApp(replaceSessionResolver(sessionResolver), replaceSessionGuard(sessionGuard))
    const getUsersService = () => app.get().get(UsersService)

    const bobEmail = 'bob@bobby.bob'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    const setUp = async () => {
        const user = await getUsersService().create({
            username: bobUsername,
            email: bobEmail,
            authId: uuid(),
        } as CreateUserDto)
        return {
            sessionUser: {
                user,
            },
        }
    }

    describe('auth guard', () => {
        it('should allow request', () => {
            sessionResolver.sessionUser = undefined
            sessionGuard.allow = true
            return request(app()).get(`/api/v1/auth/session`).send().expect(HttpStatus.OK)
        })
        it('should forbid request', () => {
            sessionResolver.sessionUser = undefined
            sessionGuard.allow = false
            return request(app()).get(`/api/v1/auth/session`).send().expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('session middleware', () => {
        it('should resolve user from session resolver', async () => {
            const { sessionUser } = await setUp()
            sessionGuard.allow = true
            sessionResolver.sessionUser = sessionUser
            const response = await request(app()).get(`/api/v1/auth/session`).send()
            expect(response.statusCode).toBe(HttpStatus.OK)
            expect(response.body.user.id).toBe(sessionUser!.user.id)
        })

        it('should not resolve user from session resolver', async () => {
            sessionGuard.allow = true
            sessionResolver.sessionUser = undefined
            const response = await request(app()).get(`/api/v1/auth/session`).send()
            expect(response.statusCode).toBe(HttpStatus.OK)
            expect(response.body.user).toBe(undefined)
        })
    })
})
