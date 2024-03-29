import { ForbiddenException } from '@nestjs/common'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { UserEntity } from '../../users/entities/user.entity'
import { Nil } from '../../utils/types'
import { CommentReactionEntity } from '../reactions/entities/comment-reaction.entity'
import { DiscussionEntity } from './discussion.entity'

@Entity('comments')
export class CommentEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { eager: true })
    author: Nil<UserEntity>

    @Column({ type: 'uuid' })
    authorId!: string

    @Column({ type: 'text' })
    content!: string

    @Column({ type: 'uuid' })
    discussionId!: string

    @ManyToOne(() => DiscussionEntity, (discussion) => discussion.comments)
    discussion?: DiscussionEntity

    @OneToMany(() => CommentReactionEntity, (reaction) => reaction.comment, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true,
    })
    reactions!: CommentReactionEntity[]

    isAuthor = (user: UserEntity) => {
        return this.authorId === user.id
    }

    isAuthorOrThrow = (user: UserEntity) => {
        if (!this.isAuthor(user)) {
            throw new ForbiddenException('The given user is not the comment author')
        }
    }
}
