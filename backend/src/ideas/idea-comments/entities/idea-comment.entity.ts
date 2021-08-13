import { BaseEntity } from '../../../database/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Idea } from '../../entities/idea.entity'
import { User } from '../../../users/user.entity'
import { Nil } from '../../../utils/types'
import { ForbiddenException } from '@nestjs/common'

@Entity('idea_comments')
export class IdeaComment extends BaseEntity {
    @ManyToOne(() => Idea, (idea) => idea.comments)
    idea: Nil<Idea>

    @ManyToOne(() => User)
    author: Nil<User>

    @Column({ type: 'text' })
    content: string

    @Column({ type: 'numeric' })
    thumbsUp: number = 0

    @Column({ type: 'numeric' })
    thumbsDown: number = 0

    constructor(idea: Idea, author: User, content: string, thumbsUp: number = 0, thumbsDown: number = 0) {
        super()
        this.idea = idea
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
    }
}
