import { Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { BlockchainConfigurationDto } from './dto/blockchain-configuration.dto'
import { ConfigService } from './config.service'

@ApiTags('configuration')
@ControllerApiVersion('/configuration', ['v1'])
export class ConfigController {
    constructor(private configService: ConfigService) {}
    @Get('blockchains')
    @ApiOkResponse({
        description: 'Respond with current supported blockchains configuration',
        type: [BlockchainConfigurationDto],
    })
    getBlockchainsConfiguration(): BlockchainConfigurationDto[] {
        return this.configService.getBlockchainsConfiguration()
    }
}
