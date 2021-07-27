import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateIdeaProposalDetailsDto } from './dto/create-idea-proposal-details.dto'
import { UpdateIdeaProposalDetailsDto } from './dto/update-idea-proposal-details.dto'
import { IdeaProposalDetails } from './idea-proposal-details.entity'

@Injectable()
export class IdeaProposalDetailsService {
    constructor(
        @InjectRepository(IdeaProposalDetails)
        private readonly detailsRepository: Repository<IdeaProposalDetails>,
    ) {}

    async create(dto: CreateIdeaProposalDetailsDto): Promise<IdeaProposalDetails> {
        const details = await this.detailsRepository.create({ ...dto, links: JSON.stringify(dto.links) })
        return this.detailsRepository.save(details)
    }

    async update(dto: UpdateIdeaProposalDetailsDto, details: IdeaProposalDetails): Promise<IdeaProposalDetails> {
        await this.detailsRepository.save({
            ...details,
            ...dto,
            links: dto.links ? JSON.stringify(dto.links) : details.links,
        })

        return (await this.detailsRepository.findOne(details.id))!
    }
}
