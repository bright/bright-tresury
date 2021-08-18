import { Body, Param, Patch, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
} from '@nestjs/swagger'
import { SessionGuard } from '../../auth/session/guard/session.guard'
import { ReqSession, SessionData } from '../../auth/session/session.decorator'
import { ControllerApiVersion } from '../../utils/ControllerApiVersion'
import { IdeaNetworkDto } from '../dto/idea-network.dto'
import { UpdateIdeaNetworkDto } from './dto/update-idea-network.dto'
import { IdeaNetworksService } from './idea-networks.service'

@ControllerApiVersion('/ideas/:ideaId/networks', ['v1'])
export class IdeaNetworksController {
    constructor(private readonly ideaNetworksService: IdeaNetworksService) {}
    @Patch(':id')
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'id',
        description: 'Idea networks id',
    })
    @ApiOkResponse({
        description: 'Idea network updated',
        type: IdeaNetworkDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea network with the given id not found',
    })
    @ApiBadRequestResponse({
        description: 'Request data is not valid',
    })
    @ApiForbiddenResponse({
        description: 'Idea network with the given id cannot be updated',
    })
    @UseGuards(SessionGuard)
    async update(@Param('id') id: string, @Body() dto: UpdateIdeaNetworkDto, @ReqSession() session: SessionData) {
        const ideaNetwork = await this.ideaNetworksService.update(id, dto, session)
        return new IdeaNetworkDto(ideaNetwork)
    }
}
