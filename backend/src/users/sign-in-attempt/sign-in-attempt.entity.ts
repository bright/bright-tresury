import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { Nil } from '../../utils/types'
import { UserEntity } from '../entities/user.entity'

@Entity('sign_in_attempt')
export class SignInAttemptEntity extends BaseEntity {
    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: Nil<UserEntity>

    @Column({ nullable: false, default: 0, type: 'numeric' })
    count: number = 0

    @Column({ nullable: true, type: 'timestamp' })
    attemptedAt?: Nil<Date>
}
