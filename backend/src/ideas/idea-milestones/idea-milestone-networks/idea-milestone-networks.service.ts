import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../../auth/session/session.decorator'
import { IdeaMilestoneNetworkEntity } from '../entities/idea-milestone-network.entity'
import { UpdateIdeaMilestoneNetworkDto } from './dto/update-idea-milestone-network.dto'
import { UpdateIdeaMilestoneNetworksDto } from './dto/update-idea-milestone-networks.dto'

@Injectable()
export class IdeaMilestoneNetworksService {
    constructor(
        @InjectRepository(IdeaMilestoneNetworkEntity)
        private readonly networkRepository: Repository<IdeaMilestoneNetworkEntity>,
    ) {}

    async updateMultiple(
        dto: UpdateIdeaMilestoneNetworksDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestoneNetworkEntity[]> {
        const networkIds = dto.items.map((network) => network.id)
        const networks = await this.networkRepository.findByIds(networkIds, {
            relations: ['ideaMilestone', 'ideaMilestone.idea'],
        })

        for (const network of networks) {
            network.ideaMilestone!.idea!.canEditMilestonesOrThrow(sessionData.user)
            network.canEditOrThrow()
            const newValue = dto.items.find((item) => item.id === network.id)?.value
            network.value = newValue ?? network.value
        }

        await this.networkRepository.save(networks)

        return this.networkRepository.findByIds(networkIds)
    }

    async update(
        id: string,
        dto: UpdateIdeaMilestoneNetworkDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestoneNetworkEntity> {
        const network = await this.networkRepository.findOne(id, { relations: ['ideaMilestone', 'ideaMilestone.idea'] })

        if (!network) {
            throw new NotFoundException('Idea milestone network with the given id does not exist')
        }

        network.ideaMilestone!.idea!.canEditMilestonesOrThrow(sessionData.user)
        network.canEditOrThrow()

        await this.networkRepository.save({ id, ...dto })
        return (await this.networkRepository.findOne(id))!
    }
}
