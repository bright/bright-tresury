import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateIdeaCommentDto } from './dto/create-idea-comment.dto'
import { IdeaComment } from './entities/idea-comment.entity'
import { Idea } from '../entities/idea.entity'
import { User } from '../../users/user.entity'
import { IdeasService } from '../ideas.service'
import { UpdateIdeaCommentDto } from './dto/update-idea-comment.dto'

@Injectable()
export class IdeaCommentsService {
    constructor(
        @InjectRepository(IdeaComment)
        private readonly ideaCommentsRepository: Repository<IdeaComment>,
        @InjectRepository(Idea)
        private readonly ideaRepository: Repository<Idea>,
        private readonly ideasService: IdeasService,
    ) {}

    async findOne(ideaId: string, commentId: string): Promise<IdeaComment> {
        const ideaComment = await this.ideaCommentsRepository.findOne(commentId, {
            relations: ['idea', 'author', 'author.web3Addresses'],
        })
        if (!ideaComment) throw new NotFoundException(`Idea comment not found: ${commentId}`)
        if (ideaId !== ideaComment.idea!.id)
            throw new NotFoundException(`Idea comment ${commentId} does not belong to idea ${ideaId}`)
        return ideaComment
    }

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

    async delete(ideaId: string, commentId: string, user: User) {
        const ideaComment = await this.findOne(ideaId, commentId)
        ideaComment.canEditOrThrow(user)
        return this.ideaCommentsRepository.remove(ideaComment)
    }

    async update(
        ideaId: string,
        commentId: string,
        updateIdeaCommentDto: UpdateIdeaCommentDto,
        user: User,
    ): Promise<IdeaComment> {
        const ideaComment = await this.findOne(ideaId, commentId)
        ideaComment.canEditOrThrow(user)
        return this.ideaCommentsRepository.save({
            ...ideaComment,
            content: updateIdeaCommentDto.content,
        })
    }
}
