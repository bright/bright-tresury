import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase, request} from "../utils/spec.helpers";
import {MockSessionGuard} from "./session/guard/session.spec.guard";
import {HttpStatus} from "@nestjs/common";
import {SessionData} from "./session/session.decorator";
import {MockSessionResolver} from "./session/session.spec.resolver";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/createUser.dto";
import {cleanAuthorizationDatabase} from "./supertokens/specHelpers/supertokens.database.spec.helper";
import {replaceSessionGuard, replaceSessionResolver} from "./supertokens/specHelpers/supertokens.providers.spec.helper";

describe(`Auth Controller`, () => {

    const sessionGuard = new MockSessionGuard()
    const sessionResolver = new MockSessionResolver()

    const app = beforeSetupFullApp(
        replaceSessionResolver(sessionResolver),
        replaceSessionGuard(sessionGuard)
    )
    const getUsersService = () => app.get().get(UsersService)

    const bobEmail = 'bob@bobby.bob'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    let sessionUser: SessionData

    beforeAll(async () => {
        const user = await getUsersService().create({
            username: bobUsername,
            email: bobEmail,
            authId: uuid()
        } as CreateUserDto)
        sessionUser = {
            user,
        }
    })

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('auth guard', () => {
        it('should allow request', () => {
            sessionResolver.sessionUser = undefined
            sessionGuard.allow = true
            return request(app())
                .get(`/api/v1/auth/session`)
                .send()
                .expect(HttpStatus.OK)
        })
        it('should forbid request', () => {
            sessionResolver.sessionUser = undefined
            sessionGuard.allow = false
            return request(app())
                .get(`/api/v1/auth/session`)
                .send()
                .expect(HttpStatus.FORBIDDEN)
        })
    })

    describe('session middleware', () => {
        it('should resolve user from session resolver', async () => {
            sessionGuard.allow = true
            sessionResolver.sessionUser = sessionUser
            const response = await request(app())
                .get(`/api/v1/auth/session`)
                .send()
                .expect(HttpStatus.OK)
            expect(response.body.user.id).toBe(sessionUser!.user.id)
        })
    })
    it('should not resolve user from session resolver', async () => {
        sessionGuard.allow = true
        sessionResolver.sessionUser = undefined
        const response = await request(app())
            .get(`/api/v1/auth/session`)
            .send()
            .expect(HttpStatus.OK)
        expect(response.body.user).toBe(undefined)
    })

})
