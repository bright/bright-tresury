import { BeforeInsert, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { Idea } from '../../entities/idea.entity'
import { User } from '../../../users/user.entity'
import { Comment } from '../../../comments/comment.entity'
import { v4 as uuid } from 'uuid'
import { Nil } from '../../../utils/types'

@Entity('idea_comments')
export class IdeaComment {
    @PrimaryColumn()
    id: string = uuid()

    @ManyToOne(() => Idea, (idea) => idea.comments)
    idea: Nil<Idea>

    @OneToOne(() => Comment, { eager: true })
    @JoinColumn()
    comment: Comment

    constructor(idea: Idea, comment: Comment) {
        this.idea = idea
        this.comment = comment
    }

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuid()
        }
    }
    canEdit = (user: User) => {
        return this.comment?.canEdit(user)
    }

    canEditOrThrow = (user: User) => {
        return this.comment?.canEditOrThrow(user)
    }
}
