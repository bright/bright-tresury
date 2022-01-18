import { Get, InternalServerErrorException } from '@nestjs/common'
import { BlockchainService } from './blockchain/blockchain.service'
import { getLogger } from './logging.module'
import { HealthCheckResponse } from './app.dto'
import { ControllerApiVersion } from './utils/ControllerApiVersion'

const logger = getLogger()

@ControllerApiVersion('/health')
export class AppController {
    constructor(private readonly blockchainService: BlockchainService) {}
    @Get()
    async healthCheck(): Promise<HealthCheckResponse> {
        logger.info('Health check!')
        const blockchainServices = await this.blockchainService.healthCheck()
        if (blockchainServices.find((service) => service.status === 'down')) {
            throw new InternalServerErrorException(blockchainServices, 'Blockchain service down')
        }
        return new HealthCheckResponse(blockchainServices)
    }
}
