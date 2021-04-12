import {User} from "supertokens-node/lib/build/recipe/emailpassword/types";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import {SuperTokensService} from "./supertokens.service";

export const SuperTokensUsernameKey = 'username'
export const SuperTokensEmailKey = 'email'
export const SessionExpiredHttpStatus = 440

export const getRecipeList = (cookieSecure: boolean, superTokensService: SuperTokensService) => [
    EmailPassword.init({
        emailVerificationFeature: {
            disableDefaultImplementation: false,
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
    })
]
