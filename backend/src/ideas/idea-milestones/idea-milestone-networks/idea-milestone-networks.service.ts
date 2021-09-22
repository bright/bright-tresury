import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../../auth/session/session.decorator'
import { IdeaMilestoneNetwork } from '../entities/idea-milestone-network.entity'
import { UpdateIdeaMilestoneNetworkDto } from './dto/update-idea-milestone-network.dto'
import { UpdateIdeaMilestoneNetworksDto } from './dto/update-idea-milestone-networks.dto'

@Injectable()
export class IdeaMilestoneNetworksService {
    constructor(
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly networkRepository: Repository<IdeaMilestoneNetwork>,
    ) {}

    async updateMultiple(
        dto: UpdateIdeaMilestoneNetworksDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestoneNetwork[]> {
        const networkIds = Object.keys(dto)
        // fetch all networks first
        const networks = await this.networkRepository.findByIds(networkIds, {
            relations: ['ideaMilestone', 'ideaMilestone.idea'],
        })
        // validate if we can modify all of them
        for (const network of networks) {
            if (!network) throw new NotFoundException('Idea milestone network with the given id does not exist')

            network.ideaMilestone!.idea!.isOwnerOrThrow(sessionData.user)
            network.canEditOrThrow()
        }
        // update all provided networks
        await Promise.all(Object.entries(dto).map(([id, update]) => this.networkRepository.save({ id, ...update })))
        // retrieve updated networks
        return this.networkRepository.findByIds(networkIds)
    }

    async update(
        id: string,
        dto: UpdateIdeaMilestoneNetworkDto,
        sessionData: SessionData,
    ): Promise<IdeaMilestoneNetwork> {
        const network = await this.networkRepository.findOne(id, { relations: ['ideaMilestone', 'ideaMilestone.idea'] })

        if (!network) {
            throw new NotFoundException('Idea milestone network with the given id does not exist')
        }

        network.ideaMilestone!.idea!.isOwnerOrThrow(sessionData.user)
        network.canEditOrThrow()

        await this.networkRepository.save({ id, ...dto })
        return (await this.networkRepository.findOne(id))!
    }
}
