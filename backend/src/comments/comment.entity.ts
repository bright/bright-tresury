import { string0To255 } from 'aws-sdk/clients/customerprofiles'
import { Column, Entity, ManyToOne } from 'typeorm'
import { ForbiddenException } from '@nestjs/common'
import { BaseEntity } from '../database/base.entity'
import { UserEntity } from '../users/user.entity'
import { Nil } from '../utils/types'

@Entity('comments')
export class CommentEntity extends BaseEntity {
    @ManyToOne(() => UserEntity)
    author: Nil<UserEntity>

    @Column({ type: 'text' })
    authorId!: string

    @Column({ type: 'text' })
    content: string

    @Column({ type: 'numeric' })
    thumbsUp: number = 0

    @Column({ type: 'numeric' })
    thumbsDown: number = 0

    constructor(author: UserEntity, content: string, thumbsUp: number = 0, thumbsDown: number = 0) {
        super()
        this.author = author
        this.content = content
        this.thumbsUp = thumbsUp
        this.thumbsDown = thumbsDown
    }

    canEdit = (user: UserEntity) => {
        return this.author?.id === user.id
    }

    canEditOrThrow = (user: UserEntity) => {
        if (!this.canEdit(user)) {
            throw new ForbiddenException('The given user has no access to this idea comment')
        }
        return true
    }
}
