import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, {addAxiosInterceptors} from "supertokens-auth-react/recipe/session";
import {api} from "./api";
import config from "./config";

export const SessionExpiredHttpStatus = 440

export function initializeSupertokens() {
    SuperTokens.init({
        appInfo: {
            appName: "Bright Treasury App",
            apiDomain: config.API_URL,
            websiteDomain: config.WEBSITE_URL,
            apiBasePath: "/api/v1"
        },
        recipeList: [
            EmailPassword.init({
                emailVerificationFeature: {
                    mode: "REQUIRED"
                },
                palette: {
                    background: '#333',
                    error: '#ad2e2e',
                    textTitle: "white",
                    textLabel: "white",
                    textInput: '#a9a9a9',
                    textPrimary: "white",
                    textLink: '#a9a9a9'
                },
                signInAndUpFeature: {
                    disableDefaultImplementation: true,
                    signUpForm: {
                        formFields: [{
                            id: "username",
                            label: "Username",
                            placeholder: "Enter username"
                        }]
                    }

                }
            }),
            Session.init({
                sessionExpiredStatusCode: SessionExpiredHttpStatus
            })
        ]
    });

    addAxiosInterceptors(api)
}
