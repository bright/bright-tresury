import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SessionData } from '../../../auth/session/session.decorator'
import { IdeaMilestoneNetwork } from '../entities/idea-milestone-network.entity'
import { UpdateIdeaMilestoneNetworkDto } from './dto/update-idea-milestone-network.dto'

@Injectable()
export class IdeaMilestoneNetworksService {
    constructor(
        @InjectRepository(IdeaMilestoneNetwork)
        private readonly networkRepository: Repository<IdeaMilestoneNetwork>,
    ) {}
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
