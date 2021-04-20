import {Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards} from '@nestjs/common';
import {ApiAcceptedResponse, ApiNotFoundResponse, ApiParam, ApiTags} from '@nestjs/swagger';
import {SessionGuard} from "../../auth/session/guard/session.guard";
import {ReqSession, SessionUser} from "../../auth/session/session.decorator";
import {CreateIdeaProposalDto} from "./dto/createIdeaProposal.dto";
import {IdeaProposalsService} from './idea.proposals.service';
import {IdeaNetworkDto, toIdeaNetworkDto} from "../dto/ideaNetwork.dto";

@Controller('/v1/ideas/:id/proposals')
@ApiTags('ideas.proposals')
export class IdeaProposalsController {

    constructor(private ideaProposalsService: IdeaProposalsService) {
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({description: 'Accepted to find a proposal extrinsic and create an entry.'})
    @ApiNotFoundResponse({description: 'Idea or idea network not found.'})
    @ApiParam({
        name: 'id',
        description: 'Idea ID'
    })
    @UseGuards(SessionGuard)
    async createProposal(
        @Param('id') ideaId: string,
        @Body() createIdeaProposalDto: CreateIdeaProposalDto,
        @ReqSession() session: SessionUser): Promise<IdeaNetworkDto> {
        const ideaNetwork = await this.ideaProposalsService.createProposal(ideaId, createIdeaProposalDto, session)
        return toIdeaNetworkDto(ideaNetwork)
    }
}
