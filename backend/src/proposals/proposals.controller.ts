import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { Proposal } from './proposal.entity';

@Controller('/api/v1/proposals')
export class ProposalsController {

  constructor(private proposalsService: ProposalsService) { }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Respond with all proposals.',
  })
  
  async getProposals(): Promise<Proposal[]> {
    const proposals = await this.proposalsService.findAll()
    return proposals;
  }
}
