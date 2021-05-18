import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiPropertyOptional,
    ApiTags,
} from '@nestjs/swagger'
import { validate as uuidValidate } from 'uuid'
import { SessionGuard } from '../auth/session/guard/session.guard'
import { ReqSession, SessionData } from '../auth/session/session.decorator'
import { IdeasService } from './ideas.service'
import { IdeaDto } from './dto/idea.dto'
import { CreateIdeaDto } from './dto/createIdea.dto'
import { UpdateIdeaDto } from './dto/updateIdea.dto'
import { IsOptional } from 'class-validator'

class GetIdeasQuery {
    @ApiPropertyOptional()
    @IsOptional()
    network?: string
}

@Controller('/v1/ideas')
@ApiTags('ideas')
export class IdeasController {
    constructor(private ideasService: IdeasService) {}

    @Get()
    @ApiOkResponse({
        description: 'Respond with all ideas.',
        type: [IdeaDto],
    })
    async getIdeas(@ReqSession() session: SessionData, @Query() query?: GetIdeasQuery): Promise<IdeaDto[]> {
        const ideas = await this.ideasService.find(query?.network, session)
        return ideas.map((idea) => new IdeaDto(idea))
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Respond with idea details.',
        type: IdeaDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea not found.',
    })
    @ApiBadRequestResponse({
        description: 'Not valid uuid parameter.',
    })
    async getIdea(@Param('id') id: string, @ReqSession() session: SessionData): Promise<IdeaDto> {
        if (!uuidValidate(id)) {
            throw new BadRequestException('Not valid uuid parameter.')
        }
        const idea = await this.ideasService.findOne(id, session)
        if (!idea) {
            throw new NotFoundException('Idea not found.')
        }
        return new IdeaDto(idea)
    }

    @ApiCreatedResponse({
        description: 'Create new idea.',
        type: IdeaDto,
    })
    @ApiBadRequestResponse({
        description: 'Title must not be empty.',
    })
    @Post()
    @UseGuards(SessionGuard)
    async createIdea(@Body() createIdeaDto: CreateIdeaDto, @ReqSession() session: SessionData): Promise<IdeaDto> {
        const idea = await this.ideasService.create(createIdeaDto, session)
        return new IdeaDto(idea)
    }

    @ApiOkResponse({
        description: 'Patched idea.',
        type: IdeaDto,
    })
    @ApiBadRequestResponse({
        description: 'Title must not be empty.',
    })
    @ApiNotFoundResponse({
        description: 'No idea found',
    })
    @Patch(':id')
    @UseGuards(SessionGuard)
    async updateIdea(
        @Body() updateIdeaDto: UpdateIdeaDto,
        @Param('id') id: string,
        @ReqSession() session: SessionData,
    ): Promise<IdeaDto> {
        const idea = await this.ideasService.update(updateIdeaDto, id, session)
        return new IdeaDto(idea)
    }

    @ApiOkResponse({
        description: 'Deleted idea.',
    })
    @ApiNotFoundResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No idea found.',
    })
    @Delete(':id')
    @UseGuards(SessionGuard)
    async delete(@Param('id') id: string, @ReqSession() session: SessionData) {
        await this.ideasService.delete(id, session)
    }
}
