import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger'
import { Get, Param, Query } from '@nestjs/common'
import { BlockchainChildBountyDto } from '../../blockchain/blockchain-child-bounties/dto/blockchain-child-bounty.dto'
import { NetworkNameQuery } from '../../utils/network-name.query'
import { IsNotEmpty, IsString } from 'class-validator'
import { BountyParam } from '../bounty.param'
import { ChildBountiesService } from './child-bounties.service'

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
        type: BlockchainChildBountyDto,
    })
    @ApiNotFoundResponse({
        description: 'Child-bounty with the given id not found',
    })
    async getOne(
        @Param() { bountyIndex, childBountyIndex }: ChildBountyParams,
        @Query() { network }: NetworkNameQuery,
    ): Promise<BlockchainChildBountyDto> {
        const childBounty = await this.childBountiesService.findOne(network, Number(bountyIndex), childBountyIndex)
        return new BlockchainChildBountyDto(childBounty)
    }
}
