import { Body, Controller, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {ApiAcceptedResponse, ApiNotFoundResponse, ApiTags, ApiParam} from '@nestjs/swagger';
import { IdeaNetwork } from "../ideaNetwork.entity";
import { CreateIdeaProposalDto } from "./dto/createIdeaProposal.dto";
import { IdeaProposalsService } from './idea.proposals.service';

@Controller('/api/v1/ideas/:id/proposals')
@ApiTags('ideas.proposals')
export class IdeaProposalsController {

    constructor(private ideaProposalsService: IdeaProposalsService) {
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'Accepted to find a proposal extrinsic and create an entry.' })
    @ApiNotFoundResponse({ description: 'Idea or idea network not found.' })
    @ApiParam({
        name: 'id',
        description: 'Idea ID'
    })
    createIdea(@Param('id') ideaId: string, @Body() createIdeaProposalDto: CreateIdeaProposalDto): Promise<IdeaNetwork> {
        return this.ideaProposalsService.createProposal(ideaId, createIdeaProposalDto)
    }
}
