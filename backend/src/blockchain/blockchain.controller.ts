import { Get, Inject } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { BlockchainConfigurationDto } from './dto/blockchain-configuration.dto'
import { BlockchainService } from './blockchain.service'

@ApiTags('configuration')
@ControllerApiVersion('/blockchains', ['v1'])
export class BlockchainController {
    constructor(@Inject(BlockchainService) private blockchainService: BlockchainService) {}
    @Get('configuration')
    @ApiOkResponse({
        description: 'Respond with current supported blockchains configuration',
        type: [BlockchainConfigurationDto],
    })
    getBlockchainsConfiguration(): BlockchainConfigurationDto[] {
        return this.blockchainService.getBlockchainsConfiguration()
    }
}
