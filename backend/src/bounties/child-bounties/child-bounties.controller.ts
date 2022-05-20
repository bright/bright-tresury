import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger'
import { Body, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common'
import { NetworkNameQuery } from '../../utils/network-name.query'
import { IsNotEmpty, IsString } from 'class-validator'
import { BountyParam } from '../bounty.param'
import { ChildBountiesService } from './child-bounties.service'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { ListenForChildBountyDto } from './dto/listen-for-child-bounty.dto'
import { ChildBountyDto } from './dto/child-bounty.dto'

class ChildBountyParams extends BountyParam {
    @ApiProperty({
        description: 'Child-bounty id',
    })
    @IsString()
    @IsNotEmpty()
    childBountyIndex!: number
}

@ControllerApiVersion('/bounties/:bountyIndex/child-bounties', ['v1'])
@ApiTags('child-bounties')
export class ChildBountiesController {
    constructor(private readonly childBountiesService: ChildBountiesService) {}

    @Get('/:childBountyIndex')
    @ApiOkResponse({
        description: 'Respond with child-bounty',
        type: ChildBountyDto,
    })
    @ApiNotFoundResponse({
        description: 'Child-bounty with the given id not found',
    })
    async getOne(
        @Param() { bountyIndex, childBountyIndex }: ChildBountyParams,
        @Query() { network }: NetworkNameQuery,
    ): Promise<ChildBountyDto> {
        const childBountyId = {
            parentBountyBlockchainIndex: Number(bountyIndex),
            blockchainIndex: childBountyIndex,
        }
        const findChildBountyDto = await this.childBountiesService.findOne(network, childBountyId)
        return new ChildBountyDto(findChildBountyDto)
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
        @Param() { bountyIndex }: BountyParam,
        @Body() dto: ListenForChildBountyDto,
        @ReqSession() sessionData: SessionData,
    ) {
        return this.childBountiesService.listenForAddedChildBountyExtrinsic(
            dto,
            parseInt(bountyIndex, 10),
            sessionData.user,
        )
    }
}
