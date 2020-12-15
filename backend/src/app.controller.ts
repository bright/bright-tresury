import {ControllerApi} from './utils/decorators'
import {Get} from '@nestjs/common'
import {HealthCheckResponse} from './app.dto'
import {getLogger} from "./logging.module";
const logger = getLogger()

@ControllerApi("/health")
export class AppController {
  @Get()
  healthCheck(): HealthCheckResponse {
    logger.info('Health check!')
    return new HealthCheckResponse()
  }
}
