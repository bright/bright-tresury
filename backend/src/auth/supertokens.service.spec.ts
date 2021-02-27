import {v4 as uuid} from 'uuid';
import {beforeSetupFullApp, cleanDatabase} from '../utils/spec.helpers';
import {SuperTokensService} from "./supertokens.service";
import {UsersService} from "../users/users.service";
import {SuperTokensUsernameKey} from "./supertokens.recipeList";
import {User as SuperTokensUser} from "supertokens-node/lib/build/recipe/emailpassword/types";

describe(`SuperTokens Service`, () => {

    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    beforeEach(async () => {
        await cleanDatabase()
    })

    describe('validate', () => {
        it('should return undefined if email is not used', async () => {
            const validationResult = await getService().validateEmail('chuck@email.com')
            expect(validationResult).toBeUndefined()
        })

        it('should return error message if email is already used', async () => {
            const email = 'chuck@email.com'
            await getUsersService().create({
                authId: uuid(),
                username: 'Chuck',
                email
            })
            const validationResult = await getService().validateEmail(email)

            expect(validationResult).toBeDefined()
            expect(typeof validationResult).toBe('string')
        })

        it('should return undefined if username is not used', async () => {
            const validationResult = await getService().validateUsername('Chucky')
            expect(validationResult).toBeUndefined()
        })

        it('should return error message if username is already taken', async () => {
            const username = 'Chucky'
            await getUsersService().create({
                authId: uuid(),
                username,
                email: 'chuck@email.com'
            })
            const validationResult = await getService().validateUsername(username)

            expect(validationResult).toBeDefined()
            expect(typeof validationResult).toBe('string')
        })
    })

    describe('handle sign up', () => {
        it('should save user in the database', async () => {
            const username = 'Chuck'
            const user = {
                id: uuid(),
                email: 'chuck@email.com'
            } as SuperTokensUser
            const additionalValues = [
                {
                    id: SuperTokensUsernameKey,
                    value: username
                }
            ]
            await getService().handleSignUp(user, additionalValues)

            const savedUser = await getUsersService().findOneByUsername(username)
            expect(savedUser).toBeDefined()
        })

        it('should save proper username and email in the database', async () => {
            const username = 'Chuck'
            const email = 'chuck@email.com'
            const user = {
                id: uuid(),
                email
            } as SuperTokensUser
            const additionalValues = [
                {
                    id: SuperTokensUsernameKey,
                    value: username
                }
            ]
            await getService().handleSignUp(user, additionalValues)

            const savedUser = await getUsersService().findOneByUsername(username)
            expect(savedUser!.email).toBe(email)
            expect(savedUser!.username).toBe(username)
        })
    })
})
