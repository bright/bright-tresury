import {BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiPropertyOptional, ApiResponse} from '@nestjs/swagger';
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
export class IdeasController {

    constructor(private ideasService: IdeasService) {
    }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Respond with all ideas.',
    })
    async getIdeas(@Query() query?: GetIdeasQuery): Promise<IdeaDto[]> {
        const ideas = await this.ideasService.find(query?.network)
        return ideas.map((idea: Idea) => toIdeaDto(idea))
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Respond with idea details.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Idea not found.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
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

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Create new idea.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Title must not be empty.',
    })
    @Post()
    async createIdea(@Body() createIdeaDto: CreateIdeaDto): Promise<IdeaDto> {
        const idea = await this.ideasService.create(createIdeaDto)
        return toIdeaDto(idea)
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Patched idea.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Title must not be empty.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No idea found',
    })
    @Patch(':id')
    async updateIdea(@Body() createIdeaDto: Partial<CreateIdeaDto>, @Param('id') id: string): Promise<IdeaDto> {
        const idea = await this.ideasService.update(createIdeaDto, id)
        return toIdeaDto(idea)
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted idea.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No idea found.',
    })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.ideasService.delete(id)
    }
}
