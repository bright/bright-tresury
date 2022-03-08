import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../users/entities/user.entity'
import { Nil } from '../utils/types'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { DiscussionDto } from './dto/discussion.dto'
import { CommentEntity } from './entites/comment.entity'
import { DiscussionEntity } from './entites/discussion.entity'

@Injectable()
export class DiscussionsService {
    constructor(
        @InjectRepository(DiscussionEntity) private readonly repository: Repository<DiscussionEntity>,
        private readonly commentsService: CommentsService,
    ) {}

    async findOne(id: string): Promise<Nil<DiscussionEntity>> {
        return await this.repository.findOne(id, { relations: ['comments'] })
    }

    async findComments(where: Partial<DiscussionEntity>): Promise<CommentEntity[]> {
        const discussion = await this.repository.findOne({
            where: { ...where },
            relations: ['comments', 'comments.author', 'comments.author.web3Addresses'],
        })
        return discussion?.comments ?? []
    }

    async addComment({ content, discussionDto }: CreateCommentDto, author: UserEntity): Promise<CommentEntity> {
        let discussion = await this.repository.findOne(discussionDto)

        if (!discussion) {
            discussion = await this.create(discussionDto)
        }

        return this.commentsService.create({ content }, author, discussion)
    }

    private async create(dto: DiscussionDto): Promise<DiscussionEntity> {
        const discussion = this.repository.create(dto)
        return this.repository.save(discussion)
    }
}
