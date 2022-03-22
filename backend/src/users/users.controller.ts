import { Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { getLogger } from '../logging.module'
import { AuthorDto } from '../utils/author.dto'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { UsersService } from './users.service'

const logger = getLogger()

@ApiTags('users')
@ControllerApiVersion('/users', ['v1'])
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with users for the given display',
        type: [AuthorDto],
    })
    async getUsersByDisplay(@Query() { display }: { display: string }): Promise<AuthorDto[]> {
        logger.info(`Getting users for display: ${display}`)
        const users = await this.service.findOneByDisplay(display)

        return users.map((user) => new AuthorDto(user))
    }
}
