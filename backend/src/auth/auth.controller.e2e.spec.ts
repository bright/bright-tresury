import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase, request} from "../utils/spec.helpers";
import {SuperTokensService} from "./supertokens/supertokens.service";
import {UsersService} from "../users/users.service";
import {cleanAuthorizationDatabase, createSessionHandler, getAuthUser} from "./supertokens/supertokens.spec.helpers";
import {SessionUser} from "./session/session.decorator";

describe(`Auth Controller`, () => {

    const baseUrl = '/api/v1/auth'

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('blockchain sign up', () => {
        it('should save user in both databases', async () => {
            await request(app())
                .post(`${baseUrl}/blockchain/signup`)
                .send({address: bobAddress, username: bobUsername, token: uuid()})
            const user = await getUsersService().findOneByUsername(bobUsername)
            expect(user).toBeDefined()
            const superTokensUser = await getAuthUser(user.authId)
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })
        it('should create session', async () => {
            const sessionHandler = await createSessionHandler(
                app(),
                {address: bobAddress, username: bobUsername, token: uuid()}
            )

            const token = uuid()
            await sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}/blockchain/register-token`)
            ).send({token})

            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )
            expect(session).toBeDefined()
        })
    })

    describe('register blockchain token', () => {
        it('should add token to the current session', async () => {
            const sessionHandler = await createSessionHandler(
                app(),
                {address: bobAddress, username: bobUsername, token: uuid()}
            )

            const token = uuid()
            await sessionHandler.authorizeRequest(request(app())
                .post(`${baseUrl}/blockchain/register-token`)
            ).send({token})

            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )
            const sessionData = await session.getSessionData() as SessionUser
            expect(sessionData.blockchainToken).toStrictEqual(token)
        })
    })
})
