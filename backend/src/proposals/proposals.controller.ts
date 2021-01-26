import {Controller, Get, Param, Query} from '@nestjs/common';
import {ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {ProposalDto} from './dto/proposal.dto';
import {ProposalsService} from "./proposals.service";

class GetProposalsQuery {
    @ApiProperty({description: 'Network name.'})
    @IsNotEmpty()
    network: string

    constructor(network: string) {
        this.network = network
    }
}

@Controller('/api/v1/proposals')
@ApiTags('proposals')
export class ProposalsController {
    constructor(private proposalsService: ProposalsService) {
    }

    @Get()
    @ApiOkResponse({description: 'Respond with proposals for selected network.',})
    async getProposals(@Query() query: GetProposalsQuery): Promise<ProposalDto[]> {
        const proposals = await this.proposalsService.find(query.network)
        return proposals.map(([proposal, idea]) => new ProposalDto(proposal, idea))
    }

    @Get(':id')
    @ApiOkResponse({description: 'Respond with a proposal for selected id in selected network.',})
    @ApiNotFoundResponse({description: 'Proposal not found.'})
    async getProposal(@Param('id') id: string, @Query() query: GetProposalsQuery): Promise<ProposalDto> {
        const [proposal, idea] = await this.proposalsService.findOne(Number(id), query.network)
        return new ProposalDto(proposal, idea)
    }
}
