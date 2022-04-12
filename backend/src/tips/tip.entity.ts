import { ForbiddenException } from '@nestjs/common'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../database/base.entity'
import { UserEntity } from '../users/entities/user.entity'
import { Nil } from '../utils/types'

@Entity('tips')
export class TipEntity extends BaseEntity {
    @Column({ nullable: false, type: 'text' })
    networkId!: string

    @Column({ nullable: false, type: 'text' })
    blockchainHash!: string

    @Column({ nullable: false, type: 'text' })
    title!: string

    @Column({ nullable: true, type: 'text' })
    description?: Nil<string>

    @ManyToOne(() => UserEntity, { eager: true })
    owner!: UserEntity
}
