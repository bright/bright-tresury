import {BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiPropertyOptional, ApiTags} from '@nestjs/swagger';
import {validate as uuidValidate} from 'uuid';
import {Idea} from './entities/idea.entity';
import {IdeasService} from './ideas.service';
import {IdeaDto, toIdeaDto} from "./dto/idea.dto";
import {CreateIdeaDto} from "./dto/createIdea.dto";
import {UpdateIdeaDto} from "./dto/updateIdea.dto";
import {IsOptional} from "class-validator";

class GetIdeasQuery {
    @ApiPropertyOptional()
    @IsOptional()
    network?: string
}

@Controller('/v1/ideas')
@ApiTags('ideas')
export class IdeasController {

    constructor(private ideasService: IdeasService) {
    }

    @Get()
    @ApiOkResponse({
        description: 'Respond with all ideas.',
        type: [IdeaDto],
    })
    async getIdeas(@Query() query?: GetIdeasQuery): Promise<IdeaDto[]> {
        const ideas = await this.ideasService.find(query?.network)
        return ideas.map((idea: Idea) => toIdeaDto(idea))
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
    async getIdea(@Param('id') id: string): Promise<IdeaDto> {
        if (!uuidValidate(id)) {
            throw new BadRequestException('Not valid uuid parameter.')
        }
        const idea = await this.ideasService.findOne(id)
        if (!idea) {
            throw new NotFoundException('Idea not found.')
        }
        return toIdeaDto(idea)
    }

    @ApiCreatedResponse({
        description: 'Create new idea.',
        type: IdeaDto,
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
        type: IdeaDto,
    })
    @ApiBadRequestResponse({
        description: 'Title must not be empty.',
    })
    @ApiNotFoundResponse({
        description: 'No idea found',
    })
    @Patch(':id')
    async updateIdea(@Body() updateIdeaDto: UpdateIdeaDto, @Param('id') id: string): Promise<IdeaDto> {
        const idea = await this.ideasService.update(updateIdeaDto, id)
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
