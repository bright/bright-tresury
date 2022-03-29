import { ForbiddenException } from '@nestjs/common'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { Nil } from '../../utils/types'
import { UserEntity } from '../../users/entities/user.entity'

@Entity('bounties')
export class BountyEntity extends BaseEntity {
    @Column({ nullable: false, type: 'text' })
    title!: string

    @Column({ nullable: true, type: 'text' })
    field?: Nil<string>

    @Column({ nullable: true, type: 'text' })
    description?: Nil<string>

    @Column({ nullable: false, type: 'text' })
    networkId!: string

    @Column({ nullable: true, type: 'text' })
    beneficiary?: Nil<string>

    @Column({ nullable: false, type: 'text' })
    blockchainIndex!: number

    @ManyToOne(() => UserEntity, { eager: true })
    owner?: Nil<UserEntity>

    @Column({ nullable: false, type: 'text' })
    ownerId!: string

    isOwner(user: UserEntity) {
        return this.ownerId === user.id
    }

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this bounty')
        }
    }
}
