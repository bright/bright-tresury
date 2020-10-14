import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { Proposal } from './proposal.entity';
import { IsString } from 'class-validator';
import { getLogger } from '../logging.module';

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
