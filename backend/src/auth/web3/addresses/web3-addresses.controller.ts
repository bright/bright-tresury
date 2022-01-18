import { Delete, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from '../../../users/users.service'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { SessionGuard } from '../../guards/session.guard'
import { ReqSession, SessionData } from '../../session/session.decorator'
import { SuperTokensService } from '../../supertokens/supertokens.service'

@ControllerApiVersion('/auth/web3/addresses/:address', ['v1'])
@ApiTags('auth.web3.addresses')
export class Web3AddressesController {
    constructor(private readonly usersService: UsersService, private readonly superTokensService: SuperTokensService) {}

    @Delete()
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Deleting successful',
    })
    @ApiBadRequestResponse({
        description: 'Could not delete this address or could not delete address that is primary',
    })
    @ApiForbiddenResponse({
        description: "Can't delete address when not signed in",
    })
    async deleteAddress(@Param('address') address: string, @ReqSession() session: SessionData) {
        await this.usersService.unlinkAddress(session.user.id, address)
        await this.superTokensService.refreshAccessTokenPayloadForUser(session.user.authId)
    }

    @Post('/make-primary')
    @HttpCode(HttpStatus.OK)
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Address successfully made primary',
    })
    @ApiBadRequestResponse({
        description: 'Could not make address primary',
    })
    @ApiForbiddenResponse({
        description: "Can't make address primary when not signed in",
    })
    async makeAddressPrimary(@Param('address') address: string, @ReqSession() session: SessionData) {
        await this.usersService.makeAddressPrimary(session.user.id, address)
        await this.superTokensService.refreshAccessTokenPayloadForUser(session.user.authId)
    }
}
