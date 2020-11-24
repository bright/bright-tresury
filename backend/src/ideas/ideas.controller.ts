import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiPropertyOptional, ApiResponse } from '@nestjs/swagger';
import { create } from 'domain';
import { validate as uuidValidate } from 'uuid';
import { Idea } from './idea.entity';
import { IdeasService } from './ideas.service';

class GetIdeasQuery {
    @ApiPropertyOptional()
    network?: string
}

@Controller('/api/v1/ideas')
export class IdeasController {

    constructor(private ideasService: IdeasService) { }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Respond with all ideas.',
    })
    getIdeas(@Query() query?: GetIdeasQuery): Promise<Idea[]> {
        return this.ideasService.find(query?.network)
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
    createIdea(@Body() createIdeaDto: CreateIdeaDto): Promise<Idea> {
        return this.ideasService.save(createIdeaDto)
    }
}
