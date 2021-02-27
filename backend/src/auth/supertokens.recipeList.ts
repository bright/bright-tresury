import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import {SuperTokensService} from "./supertokens.service";

export const SuperTokensUsernameKey = 'username'

export const getRecipeList = (superTokensService: SuperTokensService) => [
    EmailPassword.init({
        emailVerificationFeature: {
            disableDefaultImplementation: true
        },
        signUpFeature: {
            formFields: [{
                id: SuperTokensUsernameKey,
                validate: superTokensService.validateUsername
            }, {
                id: "email",
                validate: superTokensService.validateEmail
            }],
            handleCustomFormFieldsPostSignUp: superTokensService.handleSignUp
        },
    }),
    Session.init()
]