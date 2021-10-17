import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { ProposalsParam } from '../proposals.param'
import { CreateProposalMilestoneDto } from './dto/create-proposal-milestone.dto'
import { ProposalMilestoneDto } from './dto/proposal-milestone.dto'
import { UpdateProposalMilestoneDto } from './dto/update-proposal-milestone.dto'
import { ProposalMilestonesService } from './proposal-milestones.service'
import { NetworkNameQuery } from '../../utils/network-name.query'

class ProposalMilestonesParams extends ProposalsParam {
    @ApiProperty({
        description: 'Proposal milestone id',
    })
    @IsString()
    @IsNotEmpty()
    milestoneId!: string
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
        @Param() { proposalIndex }: ProposalsParam,
        @Query() { network }: NetworkNameQuery,
    ): Promise<ProposalMilestoneDto[]> {
        const milestones = await this.proposalMilestonesService.find(Number(proposalIndex), network)
        return milestones.map((milestone) => new ProposalMilestoneDto(milestone))
    }

    @Get('/:milestoneId')
    @ApiOkResponse({
        description: 'Respond with proposal milestone',
        type: ProposalMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Proposal milestone with the given id not found',
    })
    async getOne(
        @Param() { proposalIndex, milestoneId }: ProposalMilestonesParams,
        @Query() { network }: NetworkNameQuery,
    ): Promise<ProposalMilestoneDto> {
        const milestone = await this.proposalMilestonesService.findOne(milestoneId, Number(proposalIndex), network)
        return new ProposalMilestoneDto(milestone)
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Respond with the created proposal milestone',
        type: ProposalMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Proposal with the given index not found.',
    })
    @ApiBadRequestResponse({
        description: 'Milestones of the given proposal cannot be edited.',
    })
    @ApiForbiddenResponse({
        description: 'The given user cannot edit milestones of the proposal.',
    })
    @UseGuards(SessionGuard)
    async create(
        @Param() { proposalIndex }: ProposalsParam,
        @Query() { network }: NetworkNameQuery,
        @Body() dto: CreateProposalMilestoneDto,
        @ReqSession() session: SessionData,
    ): Promise<ProposalMilestoneDto> {
        const milestone = await this.proposalMilestonesService.create(Number(proposalIndex), network, dto, session)
        return new ProposalMilestoneDto(milestone)
    }

    @Patch('/:milestoneId')
    @ApiOkResponse({
        description: 'Respond with the update proposal milestone',
        type: ProposalMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Proposal with the given index or milestone with the given id not found.',
    })
    @ApiBadRequestResponse({
        description: 'Milestones of the given proposal cannot be edited.',
    })
    @ApiForbiddenResponse({
        description: 'The given user cannot edit the milestones.',
    })
    @UseGuards(SessionGuard)
    async update(
        @Param() { proposalIndex, milestoneId }: ProposalMilestonesParams,
        @Query() { network }: NetworkNameQuery,
        @Body() dto: UpdateProposalMilestoneDto,
        @ReqSession() session: SessionData,
    ): Promise<ProposalMilestoneDto> {
        const milestone = await this.proposalMilestonesService.update(
            milestoneId,
            Number(proposalIndex),
            network,
            dto,
            session,
        )
        return new ProposalMilestoneDto(milestone)
    }

    @Delete('/:milestoneId')
    @ApiOkResponse({
        description: 'The proposal milestone was removed',
    })
    @ApiNotFoundResponse({
        description: 'Proposal with the given index or milestone with the given id not found.',
    })
    @ApiBadRequestResponse({
        description: 'Milestones of the given proposal cannot be edited.',
    })
    @ApiForbiddenResponse({
        description: 'The given user cannot edit the milestones.',
    })
    @UseGuards(SessionGuard)
    async delete(
        @Param() { proposalIndex, milestoneId }: ProposalMilestonesParams,
        @Query() { network }: NetworkNameQuery,
        @ReqSession() session: SessionData,
    ): Promise<void> {
        await this.proposalMilestonesService.delete(milestoneId, Number(proposalIndex), network, session)
    }
}
