import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { SessionGuard } from '../../auth/guards/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { CreateIdeaMilestoneDto } from './dto/create-idea-milestone.dto'
import { IdeaMilestoneDto } from './dto/idea-milestone.dto'
import { UpdateIdeaMilestoneDto } from './dto/update-idea-milestone.dto'
import { IdeaMilestonesService } from './idea-milestones.service'
import { getLogger } from '../../logging.module'

const logger = getLogger()

@ControllerApiVersion('/ideas/:ideaId/milestones', ['v1'])
@ApiTags('ideas.milestones')
export class IdeaMilestonesController {
    constructor(private readonly ideaMilestonesService: IdeaMilestonesService) {}

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
    async getAll(@Param('ideaId') ideaId: string, @ReqSession() session: SessionData): Promise<IdeaMilestoneDto[]> {
        const ideaMilestones = await this.ideaMilestonesService.find(ideaId, session)
        return ideaMilestones.map((ideaMilestone) => new IdeaMilestoneDto(ideaMilestone))
    }

    @Get(':ideaMilestoneId')
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'ideaMilestoneId',
        description: 'Idea milestone id',
    })
    @ApiOkResponse({
        description: 'Respond with idea milestone',
        type: IdeaMilestoneDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea or idea milestone with the given id not found',
    })
    async getOne(
        @Param('ideaId') ideaId: string,
        @Param('ideaMilestoneId') ideaMilestoneId: string,
        @ReqSession() session: SessionData,
    ): Promise<IdeaMilestoneDto> {
        const ideaMilestone = await this.ideaMilestonesService.findOne(ideaMilestoneId, session)
        return new IdeaMilestoneDto(ideaMilestone)
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
        description: 'Idea with the given id not found.',
    })
    @ApiBadRequestResponse({
        description: 'End date of the milestone cannot be prior to the start date',
    })
    @ApiForbiddenResponse({
        description: 'Milestones cannot be added to the given idea',
    })
    @UseGuards(SessionGuard)
    async create(
        @Param('ideaId') ideaId: string,
        @Body() createIdeaMilestoneDto: CreateIdeaMilestoneDto,
        @ReqSession() session: SessionData,
    ): Promise<IdeaMilestoneDto> {
        const ideaMilestone = await this.ideaMilestonesService.create(ideaId, createIdeaMilestoneDto, session)
        return new IdeaMilestoneDto(ideaMilestone)
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
        description: 'Idea milestone with the given id not found',
    })
    @ApiBadRequestResponse({
        description: 'End date of the milestone cannot be prior to the start date',
    })
    @ApiForbiddenResponse({
        description: 'Idea milestone with the given id cannot be edited',
    })
    @UseGuards(SessionGuard)
    async update(
        @Param('ideaMilestoneId') ideaMilestoneId: string,
        @Body() updateIdeaMilestoneDto: UpdateIdeaMilestoneDto,
        @ReqSession() session: SessionData,
    ) {
        const updatedIdeaMilestone = await this.ideaMilestonesService.update(
            ideaMilestoneId,
            updateIdeaMilestoneDto,
            session,
        )
        return new IdeaMilestoneDto(updatedIdeaMilestone)
    }

    @ApiOkResponse({
        description: 'Deleted idea milestone.',
    })
    @ApiNotFoundResponse({
        description: 'No idea milestone found.',
    })
    @ApiForbiddenResponse({
        description: 'Idea milestone with the given id cannot be deleted',
    })
    @Delete(':ideaMilestoneId')
    @UseGuards(SessionGuard)
    async delete(@Param('ideaMilestoneId') ideaMilestoneId: string, @ReqSession() session: SessionData) {
        logger.info(`Deleting idea milestone ${ideaMilestoneId}...`)
        await this.ideaMilestonesService.delete(ideaMilestoneId, session)
    }
}
