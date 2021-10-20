import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCommentDto } from '../../comments/dto/create-comment.dto'
import { IdeaComment } from './entities/idea-comment.entity'
import { User } from '../../users/user.entity'
import { IdeasService } from '../ideas.service'
import { UpdateCommentDto } from '../../comments/dto/update-comment.dto'
import { Comment } from '../../comments/comment.entity'

@Injectable()
export class IdeaCommentsService {
    constructor(
        @InjectRepository(IdeaComment)
        private readonly ideaCommentsRepository: Repository<IdeaComment>,
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
        private readonly ideasService: IdeasService,
    ) {}

    async findOne(ideaId: string, commentId: string): Promise<IdeaComment> {
        const ideaComment = await this.ideaCommentsRepository.findOne({
            relations: ['idea', 'comment', 'comment.author', 'comment.author.web3Addresses'],
            where: { comment: { id: commentId }, idea: { id: ideaId } },
        })
        if (!ideaComment)
            throw new NotFoundException(`IdeaComment not found - commentId: ${commentId}, ideaId: ${ideaId}`)

        return ideaComment
    }

    async findAll(ideaId: string): Promise<IdeaComment[]> {
        return this.ideaCommentsRepository.find({
            where: { idea: { id: ideaId } },
            relations: ['comment', 'comment.author', 'comment.author.web3Addresses'],
        })
    }

    async create(ideaId: string, author: User, dto: CreateCommentDto): Promise<IdeaComment> {
        const idea = await this.ideasService.findOne(ideaId, { user: author })
        if (idea.isDraft()) throw new BadRequestException('Could not create a comment to idea with draft status')

        const comment = await this.commentsRepository.save(new Comment(author, dto.content))
        return await this.ideaCommentsRepository.save(new IdeaComment(idea, comment))
    }

    async delete(ideaId: string, commentId: string, user: User) {
        const ideaComment = await this.findOne(ideaId, commentId)
        ideaComment.canEditOrThrow(user)
        // its ok to remove from commentsRepository only because the ideaComment will be auto removed with cascade rule
        await this.commentsRepository.remove(ideaComment.comment)
        return ideaComment
    }

    async update(
        ideaId: string,
        commentId: string,
        updateCommentDto: UpdateCommentDto,
        user: User,
    ): Promise<IdeaComment> {
        const ideaComment = await this.findOne(ideaId, commentId)
        ideaComment.canEditOrThrow(user)
        await this.commentsRepository.save({
            ...ideaComment.comment,
            content: updateCommentDto.content,
        })
        return await this.findOne(ideaId, commentId)
    }
}
