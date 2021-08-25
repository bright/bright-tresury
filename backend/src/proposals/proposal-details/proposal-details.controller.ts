import { Body, Param, Patch, Query, UseGuards } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../auth/session/guard/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { IdeaProposalDetailsDto } from '../../idea-proposal-details/dto/idea-proposal-details.dto'
import { UpdateIdeaProposalDetailsDto } from '../../idea-proposal-details/dto/update-idea-proposal-details.dto'
import { getLogger } from '../../logging.module'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { ProposalsParam } from '../proposals.param'
import { ProposalsQuery } from '../proposals.query'
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
    @UseGuards(SessionGuard)
    async update(
        @Param() { proposalIndex }: ProposalsParam,
        @Query() { network }: ProposalsQuery,
        @Body() dto: UpdateIdeaProposalDetailsDto,
        @ReqSession() session: SessionData,
    ): Promise<IdeaProposalDetailsDto> {
        logger.info(`Updating details of proposal ${proposalIndex} in network ${network} with data: `, dto)
        const details = await this.proposalDetailsService.update(Number(proposalIndex), network, dto, session)
        logger.info(`Proposal ${proposalIndex} in network ${network} successfully updated.`, details)
        return new IdeaProposalDetailsDto(details)
    }
}
