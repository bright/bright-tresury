import { Get, Param, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, Validate } from 'class-validator'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { IsValidNetworkConstraint } from '../../utils/network.validator'
import { ProposalMilestoneDto } from './dto/proposal-milestone.dto'
import { ProposalMilestonesService } from './proposal-milestones.service'

class GetProposalMilestonesParams {
    @ApiProperty({
        description: 'Proposal index',
    })
    @IsNumberString()
    @IsNotEmpty()
    proposalIndex!: string
}

class GetProposalsQuery {
    @ApiProperty({
        description: 'Network name',
    })
    @IsNotEmpty()
    @Validate(IsValidNetworkConstraint)
    network!: string
}

@ControllerApiVersion('/proposals/:proposalIndex/milestones', ['v1'])
@ApiTags('proposals.milestones')
export class ProposalMilestonesController {
    constructor(private readonly proposalMilestonesService: ProposalMilestonesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with all proposal milestones.',
        type: [ProposalMilestoneDto],
    })
    @ApiNotFoundResponse({
        description: 'Proposal with the given index not found.',
    })
    async getAll(
        @Param() { proposalIndex }: GetProposalMilestonesParams,
        @Query() { network }: GetProposalsQuery,
    ): Promise<ProposalMilestoneDto[]> {
        const milestones = await this.proposalMilestonesService.find(Number(proposalIndex), network)
        return milestones.map((milestone) => new ProposalMilestoneDto(milestone))
    }

    @Get('/:milestoneId')
    @ApiParam({
        name: 'milestoneId',
        description: 'Proposal milestone id',
    })
    @ApiOkResponse({
        description: 'Respond with proposal milestone',
        type: ProposalMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Proposal milestone with the given id not found',
    })
    async getOne(
        @Param() { proposalIndex }: GetProposalMilestonesParams,
        @Param('milestoneId') milestoneId: string,
        @ReqSession() session: SessionData,
    ): Promise<ProposalMilestoneDto> {
        const milestone = await this.proposalMilestonesService.findOne(milestoneId, Number(proposalIndex))
        return new ProposalMilestoneDto(milestone)
    }
}
