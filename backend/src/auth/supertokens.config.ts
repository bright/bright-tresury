import supertokens from "supertokens-node";
import {AppConfig} from "../config/config";
import {UsersService} from "../users/users.service";
import {getRecipeList} from "./supertokens.recipeList";
import {baseApiPath} from "../main";

export function initializeSupertokens(config: AppConfig, usersService: UsersService) {
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
        recipeList: getRecipeList(usersService)
    });
}
