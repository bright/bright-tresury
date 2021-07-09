import { Get, Param, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { getLogger } from '../logging.module'
import { ControllerApiVersion } from '../utils/ControllerApiVersion'
import { ProposalDto } from './dto/proposal.dto'
import { ProposalsParam } from './proposals.param'
import { ProposalsService } from './proposals.service'
import { NetworkNameQuery } from '../utils/network-name.query'

const logger = getLogger()

@ApiTags('proposals')
@ControllerApiVersion('/proposals', ['v1'])
export class ProposalsController {
    constructor(private proposalsService: ProposalsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with proposals for the given network',
        type: [ProposalDto],
    })
    async getProposals(@Query() { network }: NetworkNameQuery): Promise<ProposalDto[]> {
        logger.info(`Getting proposals for network: ${network}`)
        const proposals = await this.proposalsService.find(network)
        return proposals.map((proposal) => new ProposalDto(proposal))
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
}
