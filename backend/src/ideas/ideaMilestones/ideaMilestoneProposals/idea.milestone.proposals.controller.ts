import {Body, Controller, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import {ApiAcceptedResponse, ApiNotFoundResponse, ApiParam, ApiTags} from "@nestjs/swagger";
import {IdeaMilestoneProposalsService} from "./idea.milestone.proposals.service";
import {CreateIdeaMilestoneProposalDto} from "./dto/CreateIdeaMilestoneProposalDto";
import {
    IdeaMilestoneNetworkDto,
    mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto
} from "../dto/ideaMilestoneNetworkDto";

@Controller('/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals')
@ApiTags('idea.milestone.proposals')
export class IdeaMilestoneProposalsController {

    constructor(
        private readonly ideaMilestoneProposalsService: IdeaMilestoneProposalsService
    ) {
    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'ideaMilestoneId',
        description: 'Idea milestone id',
    })
    @ApiAcceptedResponse({
        description: 'Accepted to find a proposal extrinsic and create an entry.'
    })
    @ApiNotFoundResponse({
        description: 'Idea/Idea milestone/Idea milestone network not found'
    })
    async createProposal(
        @Param('ideaId') ideaId: string,
        @Param('ideaMilestoneId') ideaMilestoneId: string,
        @Body() createIdeaMilestoneProposalDto: CreateIdeaMilestoneProposalDto
    ): Promise<IdeaMilestoneNetworkDto> {
        const ideaMilestoneNetwork = await this.ideaMilestoneProposalsService.createProposal(ideaId, ideaMilestoneId, createIdeaMilestoneProposalDto)
        return mapIdeaMilestoneNetworkEntityToIdeaMilestoneNetworkDto(ideaMilestoneNetwork)
    }

}
