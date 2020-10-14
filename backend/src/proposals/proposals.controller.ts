import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiModelPropertyOptional, ApiResponse } from '@nestjs/swagger';
import { Proposal } from './proposal.entity';
import { ProposalsService } from './proposals.service';

class GetProposalsQuery {
    @ApiModelPropertyOptional()
    network?: string
}

@Controller('/api/v1/proposals')
export class ProposalsController {

    constructor(private proposalsService: ProposalsService) { }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Respond with all proposals.',
    })
    async getProposals(@Query() query?: GetProposalsQuery): Promise<Proposal[]> {
        return this.proposalsService.find(query?.network)
    }
}
