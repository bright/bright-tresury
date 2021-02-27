import supertokens from "supertokens-node";
import {AppConfig} from "../config/config";
import {getRecipeList} from "./supertokens.recipeList";
import {baseApiPath} from "../main";
import {SuperTokensService} from "./supertokens.service";

export function initializeSupertokens(config: AppConfig, superTokensService: SuperTokensService) {
    supertokens.init({
        supertokens: {
            connectionURI: config.authCoreUrl,
        },
        appInfo: {
            appName: "Bright Treasury App",
            apiDomain: config.apiUrl,
            websiteDomain: config.websiteUrl,
            apiBasePath: `${baseApiPath}`
        },
        recipeList: getRecipeList(superTokensService)
    });
}
