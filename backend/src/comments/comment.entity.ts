import { string0To255 } from 'aws-sdk/clients/customerprofiles'
import { Column, Entity, ManyToOne } from 'typeorm'
import { ForbiddenException } from '@nestjs/common'
import { BaseEntity } from '../database/base.entity'
import { User } from '../users/user.entity'
import { Nil } from '../utils/types'

@Entity('comments')
export class Comment extends BaseEntity {
    @ManyToOne(() => User)
    author: Nil<User>

    @Column({ type: 'text' })
    authorId!: string

    @Column({ type: 'text' })
    content: string

    @Column({ type: 'numeric' })
    thumbsUp: number = 0

    @Column({ type: 'numeric' })
    thumbsDown: number = 0

    constructor(author: User, content: string, thumbsUp: number = 0, thumbsDown: number = 0) {
        super()
        this.author = author
        this.content = content
        this.thumbsUp = thumbsUp
        this.thumbsDown = thumbsDown
    }

    canEdit = (user: User) => {
        return this.author?.id === user.id
    }

    canEditOrThrow = (user: User) => {
        if (!this.canEdit(user)) {
            throw new ForbiddenException('The given user has no access to this idea comment')
        }
        return true
    }
}
