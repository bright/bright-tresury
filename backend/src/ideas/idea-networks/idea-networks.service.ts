import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { IdeaNetwork } from '../entities/idea-network.entity'
import { UpdateIdeaNetworkDto } from './dto/update-idea-network.dto'

@Injectable()
export class IdeaNetworksService {
    constructor(
        @InjectRepository(IdeaNetwork)
        private readonly ideaNetworkRepository: Repository<IdeaNetwork>,
    ) {}
    async update(id: string, dto: UpdateIdeaNetworkDto, sessionData: SessionData): Promise<IdeaNetwork> {
        const ideaNetwork = await this.ideaNetworkRepository.findOne(id, { relations: ['idea'] })

        if (!ideaNetwork) {
            throw new NotFoundException('Idea network with the given id does not exist')
        }

        ideaNetwork.idea!.isOwnerOrThrow(sessionData.user)
        ideaNetwork.canEditOrThrow()

        await this.ideaNetworkRepository.save({ id, ...dto })
        return (await this.ideaNetworkRepository.findOne(id))!
    }
}
