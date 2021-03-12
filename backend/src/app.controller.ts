import {Controller, Get} from '@nestjs/common'
import {getLogger} from "./logging.module";
import {HealthCheckResponse} from './app.dto'

const logger = getLogger()

@Controller("/health")
export class AppController {
  @Get()
  healthCheck(): HealthCheckResponse {
    logger.info('Health check!')
    return new HealthCheckResponse()
  }
}
