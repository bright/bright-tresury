import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger'
import { Body, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { NetworkNameQuery } from '../../utils/network-name.query'
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'
import { BountyParam } from '../bounty.param'
import { ChildBountiesService } from './child-bounties.service'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { ListenForChildBountyDto } from './dto/listen-for-child-bounty.dto'
import { ChildBountyDto } from './dto/child-bounty.dto'
import { UpdateChildBountyDto } from './dto/update-child-bounty.dto'

class ChildBountyParams extends BountyParam {
    @ApiProperty({
        description: 'Child-bounty id',
    })
    @IsString()
    @IsNumberString()
    @IsNotEmpty()
    childBountyIndex!: string
}

@ControllerApiVersion('/bounties/:bountyIndex/child-bounties', ['v1'])
@ApiTags('child-bounties')
export class ChildBountiesController {
    constructor(private readonly childBountiesService: ChildBountiesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with child-bounties',
        type: [ChildBountyDto],
    })
    @ApiNotFoundResponse({
        description: 'Bounty with the given id not found',
    })
    async getAll(
        @Param() { bountyIndex }: BountyParam,
        @Query() { network }: NetworkNameQuery,
    ): Promise<ChildBountyDto[]> {
        const findChildBountyDtos = await this.childBountiesService.findByParentBountyBlockchainIndex(
            network,
            Number(bountyIndex),
        )
        return findChildBountyDtos.map((findChildBountyDto) => new ChildBountyDto(findChildBountyDto))
    }

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
            blockchainIndex: Number(childBountyIndex),
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

    @Patch(':childBountyIndex')
    @ApiOkResponse({
        description: 'Child bounty details successfully edited',
    })
    @ApiForbiddenResponse({
        description: 'You are not allowed to edit this child bounty',
    })
    @ApiBadRequestResponse({
        description: 'Not valid data or this child bounty cannot be edited',
    })
    @ApiNotFoundResponse({
        description: 'The child bounty with the given id in the given network does not exist',
    })
    @UseGuards(SessionGuard)
    async editChildBounty(
        @Param() { bountyIndex, childBountyIndex }: ChildBountyParams,
        @Body() dto: UpdateChildBountyDto,
        @Query() { network }: NetworkNameQuery,
        @ReqSession() sessionData: SessionData,
    ): Promise<ChildBountyDto> {
        const childBountyId = {
            parentBountyBlockchainIndex: Number(bountyIndex),
            blockchainIndex: Number(childBountyIndex),
        }
        const childBounty = await this.childBountiesService.update(childBountyId, network, dto, sessionData.user)
        return new ChildBountyDto(childBounty)
    }
}
