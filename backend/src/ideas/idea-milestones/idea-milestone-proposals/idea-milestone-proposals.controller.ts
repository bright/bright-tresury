import { Body, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../../auth/session/guard/session.guard'
import { ReqSession, SessionData } from '../../../auth/session/session.decorator'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { IdeaMilestoneNetworkDto } from '../dto/idea-milestone-network.dto'
import { CreateIdeaMilestoneProposalDto } from './dto/create-idea-milestone-proposal.dto'
import { IdeaMilestoneProposalsService } from './idea-milestone-proposals.service'

@ControllerApiVersion('/ideas/:ideaId/milestones/:ideaMilestoneId/proposals', ['v1'])
@ApiTags('idea.milestone.proposals')
export class IdeaMilestoneProposalsController {
    constructor(private readonly ideaMilestoneProposalsService: IdeaMilestoneProposalsService) {}

    @Post()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'ideaMilestoneId',
        description: 'Idea milestone id',
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({
        description: 'Accepted to find a proposal extrinsic and create an entry',
    })
    @ApiNotFoundResponse({
        description: 'Idea/Idea milestone/Idea milestone network not found',
    })
    @ApiBadRequestResponse({
        description: `
            Idea with the given id is already converted to proposal or
            Beneficiary of the idea with the given id is not given or
            Idea milestone with the given id is already converted to proposal or
            Value of the idea milestone network with the given id is not greater than zero
        `,
    })
    @UseGuards(SessionGuard)
    async create(
        @Param('ideaId') ideaId: string,
        @Param('ideaMilestoneId') ideaMilestoneId: string,
        @Body() createIdeaMilestoneProposalDto: CreateIdeaMilestoneProposalDto,
        @ReqSession() sessionData: SessionData,
    ): Promise<IdeaMilestoneNetworkDto> {
        const ideaMilestoneNetwork = await this.ideaMilestoneProposalsService.createProposal(
            ideaId,
            ideaMilestoneId,
            createIdeaMilestoneProposalDto,
            sessionData,
        )
        return new IdeaMilestoneNetworkDto(ideaMilestoneNetwork)
    }
}
