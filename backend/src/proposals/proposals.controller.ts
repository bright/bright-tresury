import {Controller, Get, Query} from '@nestjs/common';
import {ApiOkResponse, ApiProperty, ApiTags} from "@nestjs/swagger";
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
    @ApiOkResponse({
        description: 'Respond with proposals for selected network.',
    })
    async getProposals(@Query() query: GetProposalsQuery): Promise<ProposalDto[]> {
        const proposals = await this.proposalsService.find(query.network)
        return proposals.map(([proposal, idea]) => new ProposalDto(proposal, idea))
    }
}
