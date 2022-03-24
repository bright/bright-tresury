import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../users/entities/user.entity'
import { CommentsService } from '../comments.service'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { CommentReactionEntity } from './entities/comment-reaction.entity'

@Injectable()
export class CommentReactionsService {
    constructor(
        @InjectRepository(CommentReactionEntity) private readonly repository: Repository<CommentReactionEntity>,
        private readonly commentsService: CommentsService,
    ) {}

    async create(dto: CreateReactionDto, commentId: string, author: UserEntity): Promise<CommentReactionEntity> {
        const comment = await this.commentsService.findOneOrThrow(commentId)

        const existingReaction = await this.repository.findOne({
            authorId: author.id,
            name: dto.name,
            commentId: commentId,
        })
        if (existingReaction) {
            throw new ForbiddenException('You cannot add multiple reactions of the same type')
        }

        const reaction = this.repository.create({ ...dto, author, comment })
        return this.repository.save(reaction)
    }

    async delete(id: string, user: UserEntity): Promise<void> {
        const reaction = await this.findOneOrThrow(id)

        reaction.isAuthorOrThrow(user)

        await this.repository.remove(reaction)
    }

    private async findOneOrThrow(id: string): Promise<CommentReactionEntity> {
        const comment = await this.repository.findOne(id)
        if (!comment) {
            throw new NotFoundException('Comment with the given id does not exist')
        }
        return comment
    }
}
