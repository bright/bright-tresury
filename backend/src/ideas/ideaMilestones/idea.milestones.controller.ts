import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags} from "@nestjs/swagger";
import {IdeaMilestonesService} from "./idea.milestones.service";
import {CreateIdeaMilestoneDto} from "./dto/createIdeaMilestoneDto";
import {IdeaMilestoneDto, mapIdeaMilestoneEntityToIdeaMilestoneDto} from "./dto/ideaMilestoneDto";
import {UpdateIdeaMilestoneDto} from "./dto/updateIdeaMilestoneDto";

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
    async getAll(@Param('ideaId') ideaId: string): Promise<IdeaMilestoneDto[]> {
        const ideaMilestones = await this.ideaMilestonesService.find(ideaId)
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
    async create(@Param('ideaId') ideaId: string, @Body() createIdeaMilestoneDto: CreateIdeaMilestoneDto): Promise<IdeaMilestoneDto> {
        const ideaMilestone = await this.ideaMilestonesService.create(ideaId, createIdeaMilestoneDto)
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
    async update(@Param('ideaMilestoneId') ideaMilestoneId: string, @Body() updateIdeaMilestoneDto: UpdateIdeaMilestoneDto) {
        const updatedIdeaMilestone = await this.ideaMilestonesService.update(ideaMilestoneId, updateIdeaMilestoneDto)
        return mapIdeaMilestoneEntityToIdeaMilestoneDto(updatedIdeaMilestone)
    }

}
