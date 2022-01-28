import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CommentEntity } from '../../../comments/comment.entity'
import { UserEntity } from '../../../users/entities/user.entity'

@Entity('proposal_comments')
export class ProposalCommentEntity {
    @PrimaryColumn()
    id: string = uuid()

    @Column({ nullable: false, type: 'integer' })
    blockchainProposalId: number

    @Column({ nullable: false, type: 'text' })
    networkId: string

    @OneToOne(() => CommentEntity, { eager: true })
    @JoinColumn()
    comment: CommentEntity

    constructor(blockchainProposalId: number, networkId: string, comment: CommentEntity) {
        this.networkId = networkId
        this.blockchainProposalId = blockchainProposalId
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
