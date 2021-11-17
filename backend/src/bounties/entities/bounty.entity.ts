import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { UserEntity } from '../../users/user.entity'
import { NetworkPlanckValue, Nil } from '../../utils/types'

@Entity('bounties')
export class BountyEntity extends BaseEntity {
    @Column({ nullable: false, type: 'text' })
    blockchainDescription!: string

    @Column('decimal', { precision: 54, scale: 0, nullable: false, default: 0 })
    value!: NetworkPlanckValue

    @Column({ nullable: false, type: 'text' })
    title!: string

    @Column({ nullable: true, type: 'text' })
    field?: Nil<string>

    @Column({ nullable: true, type: 'text' })
    description?: Nil<string>

    @Column({ nullable: false, type: 'text' })
    networkId!: string

    @Column({ nullable: false, type: 'text' })
    proposer!: string

    @Column({ nullable: false, type: 'text' })
    blockchainIndex!: number

    @ManyToOne(() => UserEntity)
    owner?: Nil<UserEntity>

    @Column({ nullable: false, type: 'text' })
    ownerId!: string
}
