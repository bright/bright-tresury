import { Body, Param, Patch, UseGuards } from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
} from '@nestjs/swagger'
import { SessionGuard } from '../../../auth/session/guard/session.guard'
import { ReqSession, SessionData } from '../../../auth/session/session.decorator'
import { ControllerApiVersion } from '../../../utils/ControllerApiVersion'
import { IdeaMilestoneNetworkDto } from '../dto/idea-milestone-network.dto'
import { UpdateIdeaMilestoneNetworkDto } from './dto/update-idea-milestone-network.dto'
import { IdeaMilestoneNetworksService } from './idea-milestone-networks.service'
import { UpdateIdeaMilestoneNetworksDto } from './dto/update-idea-milestone-networks.dto'

@ControllerApiVersion('/ideas/:ideaId/milestones/:milestoneId/networks', ['v1'])
export class IdeaMilestoneNetworksController {
    constructor(private readonly networksService: IdeaMilestoneNetworksService) {}

    @Patch()
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'milestoneId',
        description: 'Idea milestone id',
    })
    @ApiOkResponse({
        description: 'Idea milestone networks updated',
        type: [IdeaMilestoneNetworkDto],
    })
    @ApiNotFoundResponse({
        description: 'Idea milestone network with the given id not found',
    })
    @ApiBadRequestResponse({
        description: 'Request data is not valid',
    })
    @ApiForbiddenResponse({
        description: 'Idea milestone network with the given id cannot be updated',
    })
    @UseGuards(SessionGuard)
    async updateMultiple(@Body() dto: UpdateIdeaMilestoneNetworksDto, @ReqSession() session: SessionData) {
        const networks = await this.networksService.updateMultiple(dto, session)
        return networks.map((network) => new IdeaMilestoneNetworkDto(network))
    }

    @Patch(':id')
    @ApiParam({
        name: 'ideaId',
        description: 'Idea id',
    })
    @ApiParam({
        name: 'milestoneId',
        description: 'Idea milestone id',
    })
    @ApiParam({
        name: 'id',
        description: 'Idea milestone network id',
    })
    @ApiOkResponse({
        description: 'Idea milestone network updated',
        type: IdeaMilestoneNetworkDto,
    })
    @ApiNotFoundResponse({
        description: 'Idea milestone network with the given id not found',
    })
    @ApiBadRequestResponse({
        description: 'Request data is not valid',
    })
    @ApiForbiddenResponse({
        description: 'Idea milestone network with the given id cannot be updated',
    })
    @UseGuards(SessionGuard)
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateIdeaMilestoneNetworkDto,
        @ReqSession() session: SessionData,
    ) {
        const network = await this.networksService.update(id, dto, session)
        return new IdeaMilestoneNetworkDto(network)
    }
}
