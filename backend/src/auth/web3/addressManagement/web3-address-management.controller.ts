import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../session/guard/session.guard'
import { ReqSession, SessionData } from '../../session/session.decorator'
import { UsersService } from '../../../users/users.service'
import { ManageAddressRequestDto } from './dto/manage-address.dto'
import { SuperTokensService } from '../../supertokens/supertokens.service'

@Controller('/v1/auth/web3/address')
@ApiTags('auth.web3.addressManagement')
export class Web3AddressManagementController {
    constructor(private readonly usersService: UsersService, private readonly superTokensService: SuperTokensService) {}

    @Post('/unlink')
    @UseGuards(SessionGuard)
    @ApiOkResponse({
        description: 'Unlinking successful',
    })
    @ApiBadRequestResponse({
        description: 'Could not unlink this address or could not unlink address that is primary',
    })
    @ApiForbiddenResponse({
        description: "Can't unlink address when not signed in",
    })
    async unlinkAddress(
        @Body() addressDto: ManageAddressRequestDto,
        @ReqSession() session: SessionData,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.usersService.unlinkAddress(session.user, addressDto.address)
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
        @Body() addressDto: ManageAddressRequestDto,
        @ReqSession() session: SessionData,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.usersService.makeAddressPrimary(session.user, addressDto.address)
        await this.superTokensService.refreshJwtPayload(req, res)
        res.status(HttpStatus.OK).send()
    }
}
