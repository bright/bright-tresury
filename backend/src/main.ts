import "reflect-metadata";
import {SwaggerModule} from "@nestjs/swagger";
import {join} from "path";
import {createApp} from './app.module';
import {AppConfig} from "./config/config";
import {getLogger} from "./logging.module";
import {generateSwaggerDocument} from "./swagger";
import {initializeSupertokens} from "./auth/supertokens.config";
import supertokens from 'supertokens-node'
import {UsersService} from "./users/users.service";
import {SuperTokensExceptionFilter} from "./auth/supertokens.exceptionFilter";

declare const module: any
const logger = getLogger()

export const baseApiPath = '/api'

async function bootstrap() {
    const app = await createApp()

    const document = generateSwaggerDocument(app)

    SwaggerModule.setup('api/documentation', app, document)
    logger.info('Configured swagger at path: api/documentation')

    const config: AppConfig = app.get('AppConfig')

    initializeSupertokens(config, app.get(UsersService))

    const NODE_ENV = config.deployEnv || 'development';
    logger.info('NODE_ENV ', NODE_ENV)

    if (NODE_ENV !== 'development') {
        app.useStaticAssets(join(__dirname, '../../../www/build'));
    }

    app.enableCors({
        origin: config.websiteUrl,
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })

    app.use(supertokens.middleware());
    app.useGlobalFilters(new SuperTokensExceptionFilter())
    app.setGlobalPrefix(baseApiPath);

    logger.info('Listen on port ', config.port)
    await app.listen(config.port)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => {
            return app.close()
        })
    }

    app.use(supertokens.errorHandler())
}

bootstrap()
