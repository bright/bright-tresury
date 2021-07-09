import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateIdeaProposalDetailsDto } from './dto/create-idea-proposal-details.dto'
import { IdeaProposalDetail } from './idea-proposal-detail.entity'

@Injectable()
export class IdeaProposalDetailsService {
    constructor(
        @InjectRepository(IdeaProposalDetail)
        private readonly detailsRepository: Repository<IdeaProposalDetail>,
    ) {}
    async create(createDetailsDto: CreateIdeaProposalDetailsDto): Promise<IdeaProposalDetail> {
        const details = new IdeaProposalDetail(
            createDetailsDto.title,
            createDetailsDto.content,
            createDetailsDto.field,
            createDetailsDto.contact,
            createDetailsDto.portfolio,
            JSON.stringify(createDetailsDto.links),
        )
        return this.detailsRepository.save(details)
    }
}
