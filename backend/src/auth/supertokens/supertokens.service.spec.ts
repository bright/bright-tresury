import { ConflictException, NotFoundException } from '@nestjs/common'
import { getUserById } from 'supertokens-node/lib/build/recipe/emailpassword'
import { User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import { v4 as uuid } from 'uuid'
import { EmailsService } from '../../emails/emails.service'
import { UsersService } from '../../users/users.service'
import { beforeSetupFullApp, cleanDatabase } from '../../utils/spec.helpers'
import { cleanAuthorizationDatabase, getAuthUser } from './specHelpers/supertokens.database.spec.helper'
import { createUserSessionHandler } from './specHelpers/supertokens.session.spec.helper'
import { SuperTokensUsernameKey } from './supertokens.recipeList'
import { SuperTokensService } from './supertokens.service'

describe(`SuperTokens Service`, () => {
    const app = beforeSetupFullApp()
    const getService = () => app.get().get(SuperTokensService)
    const getUsersService = () => app.get().get(UsersService)

    beforeEach(async () => {
        await cleanDatabase()
        await cleanAuthorizationDatabase()
    })

    describe('validate', () => {
        it('should return undefined if username is not used', async () => {
            const validationResult = await getService().getUsernameValidationError('Chucky')
            expect(validationResult).toBeUndefined()
        })

        it('should return error message if username is already taken', async () => {
            const username = 'Chucky'
            await getUsersService().create({
                authId: uuid(),
                username,
                email: 'chuck@email.com',
            })
            const validationResult = await getService().getUsernameValidationError(username)

            expect(validationResult).toBeDefined()
            expect(typeof validationResult).toBe('string')
        })
    })

    describe('handle sign up', () => {
        it('should save user in the database', async () => {
            const username = 'Chuck'
            const user = {
                id: uuid(),
                email: 'chuck@email.com',
            } as SuperTokensUser
            const additionalValues = [
                {
                    id: SuperTokensUsernameKey,
                    value: username,
                },
            ]
            await getService().handleCustomFormFieldsPostSignUp(user, additionalValues)

            const savedUser = await getUsersService().findOneByUsername(username)
            expect(savedUser).toBeDefined()
        })

        it('should save proper username and email in the database', async () => {
            const username = 'Chuck'
            const email = 'chuck@email.com'
            const user = {
                id: uuid(),
                email,
            } as SuperTokensUser
            const additionalValues = [
                {
                    id: SuperTokensUsernameKey,
                    value: username,
                },
            ]
            await getService().handleCustomFormFieldsPostSignUp(user, additionalValues)

            const savedUser = await getUsersService().findOneByUsername(username)
            expect(savedUser!.email).toBe(email)
            expect(savedUser!.username).toBe(username)
        })
    })

    describe('send verify email template', () => {
        it('should send email', async () => {
            const spy = jest
                .spyOn(app.get().get(EmailsService), 'sendVerifyEmail')
                .mockImplementationOnce(async (to: string, verifyUrl: string) => {
                    return
                })
            const user = {
                id: uuid(),
                email: 'chuck@email.com',
            } as SuperTokensUser
            const verifyUrlWithToken = 'http://example.com?token=aaa'
            await getService().sendVerifyEmail(user, verifyUrlWithToken)
            expect(spy).toHaveBeenCalledWith(user.email, verifyUrlWithToken)
        })
    })

    describe('update email', () => {
        it('should update valid email', async () => {
            const user = await getService().signUp('chuck@example.com', uuid())
            await getService().updateEmail(user.id, 'other-email@example.com')

            const actualUser = await getUserById(user.id)
            expect(actualUser?.email).toBe('other-email@example.com')
        })

        it('should throw not found for not existing user id', async () => {
            await expect(getService().updateEmail(uuid(), 'other-email@example.com')).rejects.toThrow(NotFoundException)
        })

        it('should throw conflict exception for already existing email id', async () => {
            const user = await getService().signUp('chuck@example.com', uuid())
            await getService().signUp('other-email@example.com', uuid())

            await expect(getService().updateEmail(user.id, 'other-email@example.com')).rejects.toThrow(
                ConflictException,
            )
        })

        it('should throw conflict exception when trying to overwrite email with the same value', async () => {
            const user = await getService().signUp('chuck@example.com', uuid())

            await expect(getService().updateEmail(user.id, 'chuck@example.com')).rejects.toThrow(ConflictException)
        })
    })
    describe('deleteUser', () => {
        it('should delete supertokens user', async () => {
            const {
                sessionData: { user },
            } = await createUserSessionHandler(app())

            await getService().deleteUser(user)

            const actual = await getAuthUser(user.id)
            expect(actual).toBeUndefined()
        })

        it('should call delete method from users service', async () => {
            const {
                sessionData: { user },
            } = await createUserSessionHandler(app())
            const spy = jest.spyOn(getUsersService(), 'delete')

            await getService().deleteUser(user)

            expect(spy).toBeCalledWith(user.id)
        })
    })
})
