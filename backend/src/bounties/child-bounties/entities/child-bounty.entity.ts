import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../database/base.entity'
import { Nil } from '../../../utils/types'
import { UserEntity } from '../../../users/entities/user.entity'

@Entity('child_bounties')
export class ChildBountyEntity extends BaseEntity {
    @Column({ nullable: false, type: 'text' })
    title!: string

    @Column({ nullable: true, type: 'text' })
    description?: Nil<string>

    @Column({ nullable: false, type: 'text' })
    networkId!: string

    @Column({ nullable: false, type: 'text' })
    blockchainIndex!: number

    @Column({ nullable: false, type: 'text' })
    parentBountyBlockchainIndex!: number

    @ManyToOne(() => UserEntity, { eager: true })
    owner?: Nil<UserEntity>

    @Column({ nullable: false, type: 'text' })
    ownerId!: string
}
