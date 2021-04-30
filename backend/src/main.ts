import "reflect-metadata";
import {SwaggerModule} from "@nestjs/swagger";
import {join} from "path";
import {createApp} from './app.module';
import {AppConfig} from "./config/config";
import {getLogger} from "./logging.module";
import {generateSwaggerDocument} from "./swagger";

declare const module: any
const logger = getLogger()

export const baseApiPath = '/api'

async function bootstrap() {
    const app = await createApp()

    const document = generateSwaggerDocument(app)

    SwaggerModule.setup(`${baseApiPath}/documentation`, app, document)
    logger.info('Configured swagger at path: api/documentation')

    const config: AppConfig = app.get('AppConfig')

    const NODE_ENV = config.deployEnv || 'development';
    logger.info('NODE_ENV ', NODE_ENV)

    if (NODE_ENV !== 'development') {
        app.useStaticAssets(join(__dirname, '../../../www/build'));
    }

    logger.info('Listen on port ', config.port)
    await app.listen(config.port)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => {
            return app.close()
        })
    }
}

bootstrap()

