import { Get, Param, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { ProposalDto } from './dto/proposal.dto'
import { ProposalsParam } from './proposals.param'
import { ProposalsService } from './proposals.service'
import { NetworkNameQuery } from '../utils/network-name.query'
import { PaginatedParams, PaginatedQueryParams } from '../utils/pagination/paginated.param'
import { PaginatedResponseDto } from '../utils/pagination/paginated.response.dto'
import { TimeFrame, TimeFrameQuery } from '../utils/time-frame.query'
import { ProposedMotionDto } from '../blockchain/dto/proposed-motion.dto'
import { ExecutedMotionDto } from '../polkassembly/dto/executed-motion.dto'
import { ProposalParam } from './proposal.param'

const logger = getLogger()

@ApiTags('proposals')
@ControllerApiVersion('/proposals', ['v1'])
export class ProposalsController {
    constructor(private proposalsService: ProposalsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with proposals for the given network',
        type: PaginatedResponseDto,
    })
    async getProposals(
        @Query() { network }: NetworkNameQuery,
        @Query() { timeFrame = TimeFrame.OnChain }: TimeFrameQuery,
        @Query() { pageNumber, pageSize }: PaginatedQueryParams,
    ): Promise<PaginatedResponseDto<ProposalDto>> {
        logger.info(`Getting proposals for network: ${network} ${timeFrame}`)
        const paginatedParams = new PaginatedParams({pageNumber, pageSize})
        const { items, total } = await this.proposalsService.find(network, timeFrame, paginatedParams)
        return {
            items: items.map( withDomainDetails => new ProposalDto(withDomainDetails)),
            total
        }
    }

    @Get(':proposalIndex')
    @ApiOkResponse({
        description: 'Respond with a proposal for the given id in the given network',
        type: ProposalDto,
    })
    @ApiNotFoundResponse({
        description: 'Proposal with the given id in the given network not found',
    })
    async getProposal(
        @Param() { proposalIndex }: ProposalsParam,
        @Query() { network }: NetworkNameQuery,
    ): Promise<ProposalDto> {
        logger.info(`Getting proposal ${proposalIndex} for network: ${network}`)
        const proposal = await this.proposalsService.findOne(Number(proposalIndex), network)
        return new ProposalDto(proposal)
    }

    @Get(':proposalIndex/motions')
    @ApiOkResponse({
        description: 'Respond with proposal motions for the given index in the given network',
        type: [ProposedMotionDto],
    })
    async getMotions(
        @Param() { proposalIndex }: ProposalParam,
        @Query() { network }: NetworkNameQuery,
    ): Promise<(ProposedMotionDto | ExecutedMotionDto)[]> {
        return this.proposalsService.getProposalMotions(network, Number(proposalIndex))
    }
}
