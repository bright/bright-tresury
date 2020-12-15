import {Get} from '@nestjs/common'
import {getLogger} from "./logging.module";
import {ControllerApi} from './utils/decorators'
import {HealthCheckResponse} from './app.dto'

const logger = getLogger()

@ControllerApi("/health")
export class AppController {
  @Get()
  healthCheck(): HealthCheckResponse {
    logger.info('Health check!')
    return new HealthCheckResponse()
  }
}
