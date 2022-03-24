import { ForbiddenException } from '@nestjs/common'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../database/base.entity'
import { UserEntity } from '../../../users/entities/user.entity'
import { Nil } from '../../../utils/types'
import { CommentEntity } from '../../entites/comment.entity'

@Entity('comment_reactions')
export class CommentReactionEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { eager: true, nullable: false })
    author: Nil<UserEntity>

    @Column({ type: 'uuid' })
    authorId!: string

    @Column({ type: 'text' })
    name!: ReactionType

    @ManyToOne(() => CommentEntity, (comment) => comment.reactions)
    comment?: CommentEntity

    @Column({ type: 'uuid' })
    commentId!: string

    isAuthor = (user: UserEntity) => {
        return this.authorId === user.id
    }

    isAuthorOrThrow = (user: UserEntity) => {
        if (!this.isAuthor(user)) {
            throw new ForbiddenException('The given user is not the comment reaction author')
        }
    }
}

export enum ReactionType {
    ThumbUp = 'thumbUp',
    ThumbDown = 'thumbDown',
}
