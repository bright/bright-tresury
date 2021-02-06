import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import {AppConfig} from "./config/config";

export function initializeSupertokens(config: AppConfig) {
    supertokens.init({
        supertokens: {
            connectionURI: config.authCoreUrl,
        },
        appInfo: {
            appName: "Bright Treasury App",
            apiDomain: config.apiUrl,
            websiteDomain: config.websiteUrl
        },
        recipeList: [
            EmailPassword.init(),
            Session.init()
        ]
    });
}
