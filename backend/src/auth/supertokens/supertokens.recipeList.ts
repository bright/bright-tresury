import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import { getLogger } from '../../logging.module'
import { SuperTokensService } from './supertokens.service'
import { User as SuperTokensUser } from 'supertokens-node/lib/build/recipe/emailpassword/types'
import { AccountTemporaryLockedError } from './account-temporary-locked.error'

export const SuperTokensUsernameKey = 'username'
export const SuperTokensEmailKey = 'email'
export const SessionExpiredHttpStatus = 440

export const getRecipeList = (cookieSecure: boolean, superTokensService: SuperTokensService) => [
    EmailPassword.init({
        override: {
            apis: (oI) => ({
                ...oI,
                signUpPOST: async (input) => {
                    if (oI.signUpPOST === undefined) {
                        throw Error('Should never come here')
                    }

                    // First we call the original implementation of signUpPOST.
                    const response = await oI.signUpPOST(input)
                    // Post sign up response, we check if it was successful
                    if (response.status === 'OK') {
                        await superTokensService.handleCustomFormFieldsPostSignUp(response.user, input.formFields)

                        const sessionHandles = await Session.getAllSessionHandlesForUser(response.user.id)
                        const payload = await superTokensService.getAccessTokenPayload(response.user.id)

                        for (const handle of sessionHandles) {
                            await Session.updateAccessTokenPayload(handle, payload)
                        }
                    }

                    return response
                }
            }),
            functions: (oI) => ({
                ...oI,
                signIn: async (input: { email: string; password: string }): Promise<
                    { status: 'OK'; user: SuperTokensUser } | { status: 'WRONG_CREDENTIALS_ERROR' }
                    > => {
                        const email = input.email
                        await superTokensService.throwIfIsLockedOut(email)
                        const response = await oI.signIn(input)
                        if (response.status === 'OK') {
                            await superTokensService.clearSignInAttemptCount(email)
                        } else {
                            await superTokensService.updateSignInAttemptCount(email)
                            await superTokensService.throwIfIsLockedOut(email)
                        }
                        return response
                    }
            })
        },
        emailVerificationFeature: {
            createAndSendCustomEmail: superTokensService.sendVerifyEmail,
        },
        signUpFeature: {
            formFields: [
                {
                    id: SuperTokensUsernameKey,
                    validate: superTokensService.getUsernameValidationError,
                },
            ],
        },
    }),
    Session.init({
        cookieSecure,
        sessionExpiredStatusCode: SessionExpiredHttpStatus,
        override: {
            functions: (originalImplementation) => {
                return {
                    ...originalImplementation,
                    async createNewSession(input) {
                        const userId = input.userId

                        try {
                            // This goes in the access token, and is availble to read on the frontend.
                            const payload = await superTokensService.getAccessTokenPayload(userId)
                            input.accessTokenPayload = {
                                ...input.accessTokenPayload,
                                ...payload,
                            }

                            // This is stored in the db against the sessionHandle for this session
                            const sessionData = await superTokensService.getSessionData(userId)
                            input.sessionData = {
                                ...input.sessionData,
                                ...sessionData,
                            }
                        } catch (err) {
                            getLogger().error(err)
                        }

                        return originalImplementation.createNewSession(input)
                    },
                }
            },
        },
    }),
]
