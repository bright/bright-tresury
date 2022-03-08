import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../users/entities/user.entity'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CommentEntity } from './entites/comment.entity'
import { DiscussionEntity } from './entites/discussion.entity'

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(CommentEntity) private readonly repository: Repository<CommentEntity>) {}

    async create(dto: { content: string }, author: UserEntity, discussion: DiscussionEntity): Promise<CommentEntity> {
        const comment = this.repository.create({ ...dto, author, discussionId: discussion.id })
        return this.repository.save(comment)
    }

    async update(id: string, dto: UpdateCommentDto, user: UserEntity): Promise<CommentEntity> {
        const comment = await this.findOneOrThrow(id)

        comment.isAuthorOrThrow(user)

        await this.repository.save({ id, ...dto })

        return (await this.repository.findOne(id))!
    }

    async delete(id: string, user: UserEntity): Promise<void> {
        const comment = await this.findOneOrThrow(id)

        comment.isAuthorOrThrow(user)

        await this.repository.remove(comment)
    }

    private async findOneOrThrow(id: string): Promise<CommentEntity> {
        const comment = await this.repository.findOne(id)
        if (!comment) {
            throw new NotFoundException('Comment with the given id does not exist')
        }
        return comment
    }
}
