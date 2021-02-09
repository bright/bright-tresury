import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import config from "./config";

export function initializeSupertokens() {
    SuperTokens.init({
        appInfo: {
            appName: "Bright Treasury App",
            apiDomain: config.API_URL,
            websiteDomain: config.WEBSITE_URL,
        },
        recipeList: [
            EmailPassword.init({
                    signInAndUpFeature: {
                        disableDefaultImplementation: true
                    }
                }),
            Session.init()
        ]
    });

}
