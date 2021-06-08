import EmailPassword from 'supertokens-node/recipe/emailpassword'
import EmailVerification from 'supertokens-node/recipe/emailverification'
import Session from 'supertokens-node/recipe/session'
import { SuperTokensService } from './supertokens.service'

export const SuperTokensUsernameKey = 'username'
export const SuperTokensEmailKey = 'email'
export const SessionExpiredHttpStatus = 440

export const getRecipeList = (cookieSecure: boolean, superTokensService: SuperTokensService) => [
    EmailPassword.init({
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
            handlePostSignUp: superTokensService.handleCustomFormFieldsPostSignUp,
        },
        sessionFeature: {
            setJwtPayload: superTokensService.setJwtPayload,
        },
    }),
    Session.init({
        cookieSecure,
        sessionExpiredStatusCode: SessionExpiredHttpStatus,
    }),
    /*
    We need to init this recipe separately to enable using supertokens function directly (i.e. isEmailVerified)
    To enable api endpoints for email verification, it is enough to configure emailVerificationFeature in EmailPassword recipe
     */
    EmailVerification.init({
        getEmailForUserId: superTokensService.getEmailForUserId,
    }),
]
