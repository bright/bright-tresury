import EmailPassword from "supertokens-node/recipe/emailpassword";
import EmailVerification from "supertokens-node/recipe/emailverification";
import Session from "supertokens-node/recipe/session";
import {SuperTokensService} from "./supertokens.service";

export const SuperTokensUsernameKey = 'username'
export const SuperTokensEmailKey = 'email'
export const SessionExpiredHttpStatus = 440

export const getRecipeList = (cookieSecure: boolean, superTokensService: SuperTokensService) => [
    EmailPassword.init({
        emailVerificationFeature: {
            createAndSendCustomEmail: superTokensService.sendVerifyEmail
        },
        signUpFeature: {
            formFields: [{
                id: SuperTokensUsernameKey,
                validate: superTokensService.getUsernameValidationError
            }],
            handleCustomFormFieldsPostSignUp: superTokensService.handleCustomFormFieldsPostSignUp
        },
    }),
    Session.init({
        cookieSecure,
        sessionExpiredStatusCode: SessionExpiredHttpStatus
    }),
    EmailVerification.init({
        getEmailForUserId: superTokensService.getEmailForUserId
    }),
]
