import { Body, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { CreateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/create-idea-proposal-details.dto'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { UpdateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { getLogger } from '../../logging.module'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { ProposalsParam } from '../proposals.param'
import { NetworkNameQuery } from '../../utils/network-name.query'
import { ProposalDetailsService } from './proposal-details.service'

const logger = getLogger()

@ApiTags('proposal.details')
@ControllerApiVersion('/proposals/:proposalIndex/details', ['v1'])
export class ProposalDetailsController {
    constructor(private proposalDetailsService: ProposalDetailsService) {}

    @Patch('')
    @ApiOkResponse({
        description: 'Respond with an updated proposal details for the given id in the given network',
        type: IdeaProposalDetailsDto,
    })
    @ApiNotFoundResponse({
        description: 'Details of a proposal with the given id in the given network not found',
    })
    @ApiBadRequestResponse({
        description: 'Some of the details are not valid or a proposal is approved and cannot be edited',
    })
    @ApiForbiddenResponse({
        description: 'You cannot edit this proposal',
    })
    @UseGuards(SessionGuard)
    async update(
        @Param() { proposalIndex }: ProposalsParam,
        @Query() { network }: NetworkNameQuery,
        @Body() dto: UpdateIdeaProposalDetailsDto,
        @ReqSession() session: SessionData,
    ): Promise<IdeaProposalDetailsDto> {
        logger.info(`Updating details of proposal ${proposalIndex} in network ${network} with data: `, dto)
        const details = await this.proposalDetailsService.update(Number(proposalIndex), network, dto, session)
        logger.info(`Proposal ${proposalIndex} in network ${network} successfully updated.`, details)
        return new IdeaProposalDetailsDto(details)
    }

    @Post('')
    @ApiCreatedResponse({
        description: 'Respond with a created proposal details for the given id in the given network',
        type: IdeaProposalDetailsDto,
    })
    @ApiNotFoundResponse({
        description: 'Details of a proposal with the given id in the given network not found',
    })
    @ApiBadRequestResponse({
        description: 'Some of the details are not valid or a proposal is approved and cannot be edited',
    })
    @ApiForbiddenResponse({
        description: 'You cannot edit this proposal',
    })
    @UseGuards(SessionGuard)
    async create(
        @Param() { proposalIndex }: ProposalsParam,
        @Query() { network }: NetworkNameQuery,
        @Body() dto: CreateIdeaProposalDetailsDto,
        @ReqSession() session: SessionData,
    ): Promise<IdeaProposalDetailsDto> {
        logger.info(`Creating details of proposal ${proposalIndex} in network ${network} with data: `, dto)
        const details = await this.proposalDetailsService.create(Number(proposalIndex), network, dto, session)
        logger.info(`Proposal ${proposalIndex} in network ${network} successfully created.`, details)
        return new IdeaProposalDetailsDto(details)
    }
}
