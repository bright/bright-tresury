import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'
import { ProposalDto } from './dto/proposal.dto'
import { ProposalsService } from './proposals.service'

class GetProposalsQuery {
    @ApiProperty({
        description: 'Network name',
    })
    @IsNotEmpty()
    network!: string
}

class GetProposalParams {
    @ApiProperty({
        description: 'Proposal index',
    })
    @IsNumberString()
    @IsNotEmpty()
    proposalIndex!: string
}

@Controller('/v1/proposals')
@ApiTags('proposals')
export class ProposalsController {
    constructor(private proposalsService: ProposalsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with proposals for the given network',
        type: [ProposalDto],
    })
    async getProposals(@Query() { network }: GetProposalsQuery): Promise<ProposalDto[]> {
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
        @Param() { proposalIndex }: GetProposalParams,
        @Query() { network }: GetProposalsQuery,
    ): Promise<ProposalDto> {
        const proposal = await this.proposalsService.findOne(Number(proposalIndex), network)
        return new ProposalDto(proposal)
    }
}
