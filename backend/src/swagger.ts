import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getLogger } from './logging.module'

const logger = getLogger()

export function generateSwaggerDocument(app: INestApplication) {
    logger.info('Start generating swagger document')

    const options = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API description')
        .setVersion('1.0')
        .addServer('http', 'https')
        .addBearerAuth()
        .build()

    const swaggerDocument = SwaggerModule.createDocument(app, options)

    logger.info('Generated swagger document')

    return swaggerDocument
}
