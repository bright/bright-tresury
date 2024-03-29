import { Body, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { CreateIdeaProposalDto } from './dto/create-idea-proposal.dto'
import { IdeaProposalsService } from './idea-proposals.service'
import { IdeaNetworkDto } from '../dto/idea-network.dto'

@ControllerApiVersion('/ideas/:id/proposals', ['v1'])
@ApiTags('ideas.proposals')
export class IdeaProposalsController {
    constructor(private ideaProposalsService: IdeaProposalsService) {}

    @Post()
    @ApiParam({
        name: 'id',
        description: 'Idea ID',
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({
        description: 'Accepted to find a proposal extrinsic and create an entry',
    })
    @ApiNotFoundResponse({
        description: 'Idea or idea network not found',
    })
    @ApiBadRequestResponse({
        description: `
            Idea with the given id or at least one of it's milestones is already converted to proposal or
            Beneficiary of the idea with the given id is not given or
            Value of the idea network with the given id is not greater than zero
        `,
    })
    @UseGuards(SessionGuard)
    async createProposal(
        @Param('id') ideaId: string,
        @Body() createIdeaProposalDto: CreateIdeaProposalDto,
        @ReqSession() sessionData: SessionData,
    ): Promise<IdeaNetworkDto> {
        const ideaNetwork = await this.ideaProposalsService.createProposal(ideaId, createIdeaProposalDto, sessionData)
        return new IdeaNetworkDto(ideaNetwork)
    }
}
