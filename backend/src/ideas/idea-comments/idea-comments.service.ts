import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateIdeaCommentDto } from './dto/create-idea-comment.dto'
import { IdeaComment } from './entities/idea-comment.entity'
import { Idea } from '../entities/idea.entity'
import { User } from '../../users/user.entity'
import { IdeasService } from '../ideas.service'

@Injectable()
export class IdeaCommentsService {
    constructor(
        @InjectRepository(IdeaComment)
        private readonly ideaCommentsRepository: Repository<IdeaComment>,
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        private readonly ideasService: IdeasService
    ) {}

    async findAll(ideaId: string): Promise<IdeaComment[]> {
        const idea = await this.ideasService.findOne(ideaId)
        return this.ideaCommentsRepository.find({
            where: { idea },
            relations: ['author', 'author.web3Addresses'],
        })
    }

    async create(ideaId: string, author: User, dto: CreateIdeaCommentDto): Promise<IdeaComment> {
        const idea = await this.ideasService.findOne(ideaId)
        return await this.ideaCommentsRepository.save(new IdeaComment(idea, author, dto.content))
    }
}
