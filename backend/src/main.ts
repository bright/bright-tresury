import "reflect-metadata";
import { SwaggerModule } from "@nestjs/swagger";
import { createApp } from './app.module';
import { AppConfig } from "./config/config";
import { getLogger } from "./logging.module";
import { generateSwaggerDocument } from "./swagger";

declare const module: any;
const logger = getLogger()

async function bootstrap() {
    const app = await createApp();

    const document = generateSwaggerDocument(app);

    SwaggerModule.setup('api/documentation', app, document);
    logger.info("Configured swagger at path: api/documentation")

    const config: AppConfig = app.get("AppConfig")
    logger.info("Listen on port ", config.port)
    await app.listen(config.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => {
            console.log('Hot dispose')
            return app.close();
        });
    }
}

bootstrap();
