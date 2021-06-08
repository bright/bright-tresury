import SuperTokens from 'supertokens-auth-react'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'
import Session, { addAxiosInterceptors } from 'supertokens-auth-react/recipe/session'
import { api } from './api'
import config from './config'

export const SessionExpiredHttpStatus = 440

export function initializeSupertokens() {
    SuperTokens.init({
        appInfo: {
            appName: 'Bright Treasury App',
            apiDomain: config.API_URL,
            websiteDomain: config.WEBSITE_URL,
            apiBasePath: '/api/v1',
        },
        recipeList: [
            EmailPassword.init({
                emailVerificationFeature: {
                    mode: 'OFF',
                    disableDefaultImplementation: true,
                },
                signInAndUpFeature: {
                    disableDefaultImplementation: true,
                    signUpForm: {
                        formFields: [
                            {
                                id: 'username',
                                label: 'Username',
                                placeholder: 'Enter username',
                            },
                        ],
                    },
                },
            }),
            Session.init({
                sessionExpiredStatusCode: SessionExpiredHttpStatus,
            }),
        ],
    })

    addAxiosInterceptors(api)
}
