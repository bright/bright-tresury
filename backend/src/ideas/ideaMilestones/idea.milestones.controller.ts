import {Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags} from "@nestjs/swagger";
import {SessionGuard} from "../../auth/session/guard/session.guard";
import {ReqSession, SessionUser} from "../../auth/session/session.decorator";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneDto, mapIdeaMilestoneEntityToIdeaMilestoneDto} from "./dto/ideaMilestoneDto";
import {UpdateIdeaMilestoneDto} from "./dto/updateIdeaMilestoneDto";
import {IdeaMilestonesService} from "./idea.milestones.service";

@Controller('/v1/ideas/:ideaId/milestones')
@ApiTags('ideas.milestones')
export class IdeaMilestonesController {

    constructor(private readonly ideaMilestonesService: IdeaMilestonesService) { }

    @Get()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiOkResponse({
        description: 'Respond with all idea milestones.',
        type: [IdeaMilestoneDto],
    })
    @ApiNotFoundResponse({
        description: 'Idea with the given id not found.',
    })
    async getAll(@Param('ideaId') ideaId: string, @ReqSession() session: SessionUser): Promise<IdeaMilestoneDto[]> {
        const ideaMilestones = await this.ideaMilestonesService.find(ideaId, session)
        return ideaMilestones.map((ideaMilestone) => mapIdeaMilestoneEntityToIdeaMilestoneDto(ideaMilestone))
    }

    @Post()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiCreatedResponse({
        description: 'New milestone created.',
        type: IdeaMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea with the given id not found.'
    })
    @ApiBadRequestResponse({
        description: 'End date of the milestone cannot be prior to the start date'
    })
    @UseGuards(SessionGuard)
    async create(@Param('ideaId') ideaId: string,
                 @Body() createIdeaMilestoneDto: CreateIdeaMilestoneDto,
                 @ReqSession() session: SessionUser): Promise<IdeaMilestoneDto> {
        const ideaMilestone = await this.ideaMilestonesService.create(ideaId, createIdeaMilestoneDto, session)
        return mapIdeaMilestoneEntityToIdeaMilestoneDto(ideaMilestone)
    }

    @Patch(':ideaMilestoneId')
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'ideaMilestoneId',
        description: 'Idea milestone id',
    })
    @ApiOkResponse({
        description: 'Idea milestone updated',
        type: IdeaMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea milestone with the given id not found'
    })
    @ApiBadRequestResponse({
        description: 'End date of the milestone cannot be prior to the start date'
    })
    @UseGuards(SessionGuard)
    async update(@Param('ideaMilestoneId') ideaMilestoneId: string,
                 @Body() updateIdeaMilestoneDto: UpdateIdeaMilestoneDto,
                 @ReqSession() session: SessionUser) {
        const updatedIdeaMilestone = await this.ideaMilestonesService.update(ideaMilestoneId, updateIdeaMilestoneDto, session)
        return mapIdeaMilestoneEntityToIdeaMilestoneDto(updatedIdeaMilestone)
    }

}
