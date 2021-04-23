import { Controller } from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {IdeaMilestoneProposalsService} from "./idea.milestone.proposals.service";

@Controller('/v1/ideas/:ideaId/milestones/:ideaMilestoneId/proposals')
@ApiTags('idea.milestone.proposals')
export class IdeaMilestoneProposalsController {

    constructor(
        private readonly ideaMilestoneProposalsService: IdeaMilestoneProposalsService
    ) {
    }

    async createProposal(@Body() createIdeaMilestoneProposalDto: CreateIdeaMilestoneProposalDto) {
        // TODO
    }

}
