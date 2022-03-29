import { Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { UsersService } from './users.service'
import { PublicUserDto } from './dto/public-user.dto'

const logger = getLogger()

@ApiTags('users')
@ControllerApiVersion('/users', ['v1'])
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with users for the given display',
        type: [PublicUserDto],
    })
    async getUsersByDisplay(@Query() { display }: { display: string }): Promise<PublicUserDto[]> {
        logger.info(`Getting users for display: ${display}`)
        return this.service.findByDisplay(display)
    }
}
