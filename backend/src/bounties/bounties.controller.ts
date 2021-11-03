import { Body, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../auth/guards/session.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { BountiesService } from './bounties.service'
import { CreateBountyDto } from './dto/create-bounty.dto'

@ControllerApiVersion('/bounties', ['v1'])
@ApiTags('bounties')
export class BountiesController {
    constructor(private bountiesService: BountiesService) {}

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiCreatedResponse({
        description: 'Accepted to find a bounty proposal extrinsic and create a bounty entity',
    })
    @ApiBadRequestResponse({
        description: 'Not valid data',
    })
    @UseGuards(SessionGuard)
    async createBounty(
        @Body() dto: CreateBountyDto,
        @ReqSession() sessionData: SessionData,
    ): Promise<ExtrinsicEntity> {
        return this.bountiesService.listenForProposeBountyExtrinsic(dto, sessionData.user)
    }
}
