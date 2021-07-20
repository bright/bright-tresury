import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateIdeaProposalDetailsDto } from './dto/create-idea-proposal-details.dto'
import { UpdateIdeaProposalDetailsDto } from './dto/update-idea-proposal-details.dto'
import { IdeaProposalDetail } from './idea-proposal-detail.entity'

@Injectable()
export class IdeaProposalDetailsService {
    constructor(
        @InjectRepository(IdeaProposalDetail)
        private readonly detailsRepository: Repository<IdeaProposalDetail>,
    ) {}
    async create(dto: CreateIdeaProposalDetailsDto): Promise<IdeaProposalDetail> {
        const details = new IdeaProposalDetail(
            dto.title,
            dto.content,
            dto.field,
            dto.contact,
            dto.portfolio,
            JSON.stringify(dto.links),
        )
        return this.detailsRepository.save(details)
    }

    async update(dto: UpdateIdeaProposalDetailsDto, details: IdeaProposalDetail): Promise<IdeaProposalDetail> {
        await this.detailsRepository.save({
            ...details,
            ...dto,
            links: dto.links ? JSON.stringify(dto.links) : details.links,
        })

        return (await this.detailsRepository.findOne(details.id))!
    }
}
