import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateIdeaProposalDetailsDto } from './dto/create-idea-proposal-details.dto'
import { UpdateIdeaProposalDetailsDto } from './dto/update-idea-proposal-details.dto'
import { IdeaProposalDetailsEntity } from './idea-proposal-details.entity'
import { IdeaEntity } from '../ideas/entities/idea.entity'

@Injectable()
export class IdeaProposalDetailsService {
    constructor(
        @InjectRepository(IdeaProposalDetailsEntity)
        private readonly detailsRepository: Repository<IdeaProposalDetailsEntity>,
    ) {}

    async create(dto: CreateIdeaProposalDetailsDto): Promise<IdeaProposalDetailsEntity> {
        const details = await this.detailsRepository.create({ ...dto, links: JSON.stringify(dto.links) })
        return this.detailsRepository.save(details)
    }

    async update(
        dto: UpdateIdeaProposalDetailsDto,
        details: IdeaProposalDetailsEntity,
    ): Promise<IdeaProposalDetailsEntity> {
        await this.detailsRepository.save({
            ...details,
            ...dto,
            links: dto.links ? JSON.stringify(dto.links) : details.links,
        })

        return (await this.detailsRepository.findOne(details.id))!
    }

    async delete(entity: IdeaProposalDetailsEntity) {
        return this.detailsRepository.remove(entity)
    }
}
