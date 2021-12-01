import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CommentEntity } from '../../../comments/comment.entity'
import { UserEntity } from '../../../users/user.entity'

@Entity('bounty_comments')
export class BountyCommentEntity {
    @PrimaryColumn()
    id: string = uuid()

    @Column({ nullable: false, type: 'integer' })
    blockchainBountyId!: number

    @Column({ nullable: false, type: 'text' })
    networkId!: string

    @OneToOne(() => CommentEntity, { eager: true })
    @JoinColumn()
    comment!: CommentEntity

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuid()
        }
    }
    canEdit = (user: UserEntity) => {
        return this.comment.canEdit(user)
    }

    canEditOrThrow = (user: UserEntity) => {
        return this.comment.canEditOrThrow(user)
    }
}
