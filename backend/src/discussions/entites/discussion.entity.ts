import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { CommentEntity } from './comment.entity'
import { DiscussionCategory } from './discussion-category'

@Entity('discussions')
export class DiscussionEntity extends BaseEntity {
    @Column()
    blockchainIndex?: number

    @Column()
    blockchainHash?: string

    @Column()
    networkId?: string

    @Column({ type: 'uuid' })
    entityId?: string

    @Column({ type: 'enum', enum: DiscussionCategory, nullable: false })
    category!: DiscussionCategory

    @OneToMany(() => CommentEntity, (comment) => comment.discussion, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true,
    })
    comments?: CommentEntity[]
}
