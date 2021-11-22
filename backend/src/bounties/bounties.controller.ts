import { Body, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../auth/guards/session.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { ExtrinsicEntity } from '../extrinsics/extrinsic.entity'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { BountiesService } from './bounties.service'
import { CreateBountyDto } from './dto/create-bounty.dto'
import { NetworkNameQuery } from '../utils/network-name.query'
import { BountyDto } from './dto/bounty.dto'
import { BountyParam } from './bounty.param'

@ControllerApiVersion('/bounties', ['v1'])
@ApiTags('bounties')
export class BountiesController {
    constructor(private bountiesService: BountiesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with current bounties for the given network',
        type: [BountyDto],
    })
    async getBounties(@Query() { network }: NetworkNameQuery): Promise<BountyDto[]> {
        const bounties = await this.bountiesService.getBounties(network)
        return bounties.map(
            ([bountyBlockchain, bountyEntity]) =>  new BountyDto(bountyBlockchain, bountyEntity)
        )
    }

    @Get(':bountyIndex')
    @ApiOkResponse({
        description: 'Respond with bounty for the given index in the given network',
        type: BountyDto,
    })
    async getBounty(
        @Param() { bountyIndex }: BountyParam,
        @Query() { network }: NetworkNameQuery
    ): Promise<BountyDto> {
        const [bountyBlockchain, bountyEntity] = await this.bountiesService.getBounty(Number(bountyIndex), network)
        return new BountyDto(bountyBlockchain, bountyEntity)
    }

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
