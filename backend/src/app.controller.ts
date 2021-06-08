import { Get } from '@nestjs/common'
import { getLogger } from './logging.module'
import { HealthCheckResponse } from './app.dto'
import { ControllerApiVersion } from './utils/ControllerApiVersion'

const logger = getLogger()

@ControllerApiVersion('/health')
export class AppController {
    @Get()
    healthCheck(): HealthCheckResponse {
        logger.info('Health check!')
        return new HealthCheckResponse()
    }
}
