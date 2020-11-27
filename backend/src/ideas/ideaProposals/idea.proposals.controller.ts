import { Body, Controller, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiAcceptedResponse } from '@nestjs/swagger';
import { IdeaNetwork } from "../ideaNetwork.entity";
import { CreateIdeaProposalDto } from "./dto/createIdeaProposal.dto";
import { IdeaProposalsService } from './idea.proposals.service';

@Controller('/api/v1/ideas/:id/proposals')
export class IdeaProposalsController {

    constructor(private ideaProposalsService: IdeaProposalsService) {
    }

    @ApiAcceptedResponse({ description: 'Accepted to create a proposal extrinsic.' })
    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    createIdea(@Param('id') ideaId: string, @Body() createIdeaProposalDto: CreateIdeaProposalDto): Promise<IdeaNetwork> {
        return this.ideaProposalsService.createProposal(ideaId, createIdeaProposalDto)
    }
}
