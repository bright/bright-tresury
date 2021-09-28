import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { Comment } from '../../../comments/comment.entity'
import { User } from '../../../users/user.entity'

@Entity('proposal_comments')
export class ProposalComment {
    @PrimaryColumn()
    id: string = uuid()

    @Column({ nullable: false, type: 'integer' })
    blockchainProposalId: number

    @Column({ nullable: false, type: 'text' })
    networkId: string

    @OneToOne(() => Comment, { eager: true })
    @JoinColumn()
    comment: Comment

    constructor(blockchainProposalId: number, networkId: string, comment: Comment) {
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
    canEdit = (user: User) => {
        return this.comment?.canEdit(user)
    }

    canEditOrThrow = (user: User) => {
        return this.comment?.canEditOrThrow(user)
    }
}
