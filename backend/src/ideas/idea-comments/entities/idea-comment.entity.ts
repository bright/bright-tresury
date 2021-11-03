import { BeforeInsert, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, Column } from 'typeorm'
import { IdeaEntity } from '../../entities/idea.entity'
import { UserEntity } from '../../../users/user.entity'
import { CommentEntity } from '../../../comments/comment.entity'
import { v4 as uuid } from 'uuid'
import { Nil } from '../../../utils/types'

@Entity('idea_comments')
export class IdeaCommentEntity {
    @PrimaryColumn()
    id: string = uuid()

    @ManyToOne(() => IdeaEntity, (idea) => idea.comments)
    idea: Nil<IdeaEntity>

    @Column()
    ideaId: string

    @OneToOne(() => CommentEntity, { eager: true })
    @JoinColumn()
    comment: CommentEntity

    constructor(idea: IdeaEntity, comment: CommentEntity) {
        this.idea = idea
        this.ideaId = idea?.id
        this.comment = comment
    }

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuid()
        }
    }
    canEdit = (user: UserEntity) => {
        return this.comment?.canEdit(user)
    }

    canEditOrThrow = (user: UserEntity) => {
        return this.comment?.canEditOrThrow(user)
    }
}
