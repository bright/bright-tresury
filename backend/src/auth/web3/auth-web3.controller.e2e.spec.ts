import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {UsersService} from "../../users/users.service";
import {createBlockchainSessionHandler} from "../supertokens/specHelpers/supertokens.session.spec.helper";
import {cleanAuthorizationDatabase, getAuthUser} from "../supertokens/specHelpers/supertokens.database.spec.helper";

describe(`Auth Web3 Controller`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('web3 sign up', () => {
        it('should save user in both databases', async () => {
            await createBlockchainSessionHandler(app(), bobAddress)
            const user = await getUsersService().findOneByBlockchainAddress(bobAddress)
            const superTokensUser = await getAuthUser(user.authId)

            expect(user).toBeDefined()
            expect(superTokensUser).toBeDefined()
            expect(superTokensUser!.id).toBe(user.authId)
        })
        it('should create session', async () => {
            const sessionHandler = await createBlockchainSessionHandler(app(), bobAddress)
            const session = await getService().getSession(
                sessionHandler.getAuthorizedRequest(), {} as any, false
            )

            expect(session).toBeDefined()
        })
    })

})
