import { Inject, Injectable } from '@nestjs/common'
import supertokens from 'supertokens-node'
import { AppConfig, AppConfigToken } from '../config/config.module'
import { baseApiPath } from '../main'
import { getRecipeList } from './supertokens/supertokens.recipeList'
import { SuperTokensService } from './supertokens/supertokens.service'

@Injectable()
export class SupertokensInitService {
    constructor(
        @Inject(AppConfigToken) private readonly appConfig: AppConfig,
        private readonly supertokensService: SuperTokensService,
    ) {
        supertokens.init({
            appInfo: {
                appName: appConfig.appName,
                websiteDomain: appConfig.websiteUrl,
                apiDomain: appConfig.apiUrl,
                apiBasePath: `${baseApiPath}/v1/auth`,
            },
            supertokens: {
                connectionURI: appConfig.auth.coreUrl,
            },
            recipeList: getRecipeList(appConfig.auth.cookieSecure, supertokensService),
        })
    }
}
