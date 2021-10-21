import { Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { BlockchainConfigurationDto } from './dto/blockchain-configuration.dto'
import { BlockchainConfigurationService } from './blockchain-configuration.service'

@ApiTags('configuration')
@ControllerApiVersion('/blockchain/configuration', ['v1'])
export class BlockchainConfigurationController {
    constructor(private blockchainConfigurationService: BlockchainConfigurationService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with current supported blockchains blockchain-configuration',
        type: [BlockchainConfigurationDto],
    })
    getAll(): BlockchainConfigurationDto[] {
        return this.blockchainConfigurationService.getBlockchainsConfigurations()
    }
}
