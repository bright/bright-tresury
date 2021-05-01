import {beforeSetupFullApp, cleanDatabase} from "../../utils/spec.helpers";
import {SuperTokensService} from "../supertokens/supertokens.service";
import {UsersService} from "../../users/users.service";
import {cleanAuthorizationDatabase} from "../supertokens/specHelpers/supertokens.database.spec.helper";

describe(`Auth Controller`, () => {

    const baseUrl = '/api/v1'
    const baseAuthUrl = `${baseUrl}/auth`

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
    const bobEmail = 'bob@bobby.bob'
    const bobUsername = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('web3 sign up', () => {
        it('should save user in both databases', async () => {

        })
    })

})
