import {beforeSetupFullApp, cleanDatabase, request} from "../../utils/spec.helpers";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {UsersService} from "../../users/users.service";
import {createSessionHandler} from "../supertokens/specHelpers/supertokens.session.spec.helper";
import {cleanAuthorizationDatabase, getAuthUser} from "../supertokens/specHelpers/supertokens.database.spec.helper";
import {AuthWeb3Service} from "./auth-web3.service";
import {v4 as uuid} from "uuid";

describe(`Auth Web3 Controller`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)
    const getWeb3Service = () => app.get().get(AuthWeb3Service)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        /**
         * Mock signature validation so that we don't use real blockchain for signing.
         */
        jest.spyOn(getWeb3Service(), 'validateSignature').mockImplementation((): boolean => true)
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('web3 sign up', () => {
        it('should save user in both databases', async () => {
            await request(app())
                .post(`/api/v1/auth/web3/signup/start`)
                .send({address: bobAddress})

            await request(app())
                .post(`/api/v1/auth/web3/signup/confirm`)
                .send({
                    address: bobAddress,
                    network: 'localhost',
                    signature: uuid()
                })

            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)

            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })
        it('should create session', async () => {
            await request(app())
                .post(`/api/v1/auth/web3/signup/start`)
                .send({address: bobAddress})

            const confirmSignUpResponse = await request(app())
                .post(`/api/v1/auth/web3/signup/confirm`)
                .send({
                    address: bobAddress,
                    network: 'localhost',
                    signature: uuid()
                })
            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const sessionHandler = createSessionHandler(confirmSignUpResponse, user)
            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )

            expect(session).toBeDefined()
        })
    })

})
