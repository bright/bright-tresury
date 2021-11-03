import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../auth/session/session.decorator'
import { IdeaNetworkEntity } from '../entities/idea-network.entity'
import { UpdateIdeaNetworkDto } from './dto/update-idea-network.dto'

@Injectable()
export class IdeaNetworksService {
    constructor(
        @InjectRepository(IdeaNetworkEntity)
        private readonly networkRepository: Repository<IdeaNetworkEntity>,
    ) {}
    async update(id: string, dto: UpdateIdeaNetworkDto, sessionData: SessionData): Promise<IdeaNetworkEntity> {
        const network = await this.networkRepository.findOne(id, { relations: ['idea'] })

        if (!network) {
            throw new NotFoundException('Idea network with the given id does not exist')
        }

        network.idea!.isOwnerOrThrow(sessionData.user)
        network.canEditOrThrow()

        await this.networkRepository.save({ id, ...dto })
        return (await this.networkRepository.findOne(id))!
    }
}
