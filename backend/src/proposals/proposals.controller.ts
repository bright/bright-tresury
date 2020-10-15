import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiModelPropertyOptional, ApiResponse } from '@nestjs/swagger';
import { validate as uuidValidate } from 'uuid';
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

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Respond with proposal details.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Proposal not found.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Not valid uuid parameter.',
    })
    async getProposal(@Param('id') id: string): Promise<Proposal> {
        if (!uuidValidate(id)) {
            throw new BadRequestException('Not valid uuid parameter.')
        }
        const proposal = await this.proposalsService.findOne(id)
        if (!proposal) {
            throw new NotFoundException('Proposal not found.')
        }
        return proposal
    }
}
