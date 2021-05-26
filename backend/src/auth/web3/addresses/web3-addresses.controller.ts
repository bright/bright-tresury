import { Controller, Delete, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../session/guard/session.guard'
import { ReqSession, SessionData } from '../../session/session.decorator'
import { UsersService } from '../../../users/users.service'
import { SuperTokensService } from '../../supertokens/supertokens.service'

@Controller('/v1/auth/web3/address/:address')
@ApiTags('auth.web3.addressManagement')
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
    async deleteAddress(
        @Param('address') address: string,
        @ReqSession() session: SessionData,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.usersService.unlinkAddress(session.user, address)
        await this.superTokensService.refreshJwtPayload(req, res)
        res.status(HttpStatus.OK).send()
    }

    @Post('/make-primary')
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
    async makeAddressPrimary(
        @Param('address') address: string,
        @ReqSession() session: SessionData,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.usersService.makeAddressPrimary(session.user, address)
        await this.superTokensService.refreshJwtPayload(req, res)
        res.status(HttpStatus.OK).send()
    }
}
