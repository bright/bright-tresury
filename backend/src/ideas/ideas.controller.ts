import {BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiPropertyOptional, ApiResponse, ApiTags} from '@nestjs/swagger';
import {validate as uuidValidate} from 'uuid';
import {Idea} from './idea.entity';
import {IdeasService} from './ideas.service';
import {IdeaDto, toIdeaDto} from "./dto/ideaDto";
import {CreateIdeaDto} from "./dto/createIdeaDto";

class GetIdeasQuery {
    @ApiPropertyOptional()
    network?: string
}

@Controller('/api/v1/ideas')
@ApiTags('ideas')
export class IdeasController {

    constructor(private ideasService: IdeasService) {
    }

    @Get()
    @ApiOkResponse({
        description: 'Respond with all ideas.',
    })
    async getIdeas(@Query() query?: GetIdeasQuery): Promise<IdeaDto[]> {
        const ideas = await this.ideasService.find(query?.network)
        return ideas.map((idea: Idea) => toIdeaDto(idea))
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Respond with idea details.',
    })
    @ApiNotFoundResponse({
        description: 'Idea not found.',
    })
    @ApiBadRequestResponse({
        description: 'Not valid uuid parameter.',
    })
    async getIdea(@Param('id') id: string): Promise<Idea> {
        if (!uuidValidate(id)) {
            throw new BadRequestException('Not valid uuid parameter.')
        }
        const idea = await this.ideasService.findOne(id)
        if (!idea) {
            throw new NotFoundException('Idea not found.')
        }
        return idea
    }

    @ApiCreatedResponse({
        description: 'Create new idea.',
    })
    @ApiBadRequestResponse({
        description: 'Title must not be empty.',
    })
    @Post()
    async createIdea(@Body() createIdeaDto: CreateIdeaDto): Promise<IdeaDto> {
        const idea = await this.ideasService.create(createIdeaDto)
        return toIdeaDto(idea)
    }

    @ApiOkResponse({
        description: 'Patched idea.',
    })
    @ApiBadRequestResponse({
        description: 'Title must not be empty.',
    })
    @ApiNotFoundResponse({
        description: 'No idea found',
    })
    @Patch(':id')
    async updateIdea(@Body() createIdeaDto: Partial<CreateIdeaDto>, @Param('id') id: string): Promise<IdeaDto> {
        const idea = await this.ideasService.update(createIdeaDto, id)
        return toIdeaDto(idea)
    }

    @ApiOkResponse({
        description: 'Deleted idea.',
    })
    @ApiNotFoundResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No idea found.',
    })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.ideasService.delete(id)
    }
}
