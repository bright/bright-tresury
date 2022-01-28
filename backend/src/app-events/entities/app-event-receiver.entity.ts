import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { UserEntity } from '../../users/entities/user.entity'
import { AppEventEntity } from './app-event.entity'

@Entity('app_event_receivers')
export class AppEventReceiverEntity extends BaseEntity {
    @ManyToOne(() => AppEventEntity)
    appEvent?: AppEventEntity

    @ManyToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'userId' })
    user!: UserEntity

    @Column({ nullable: false, type: 'text' })
    userId!: string

    @Column({ nullable: false, type: 'boolean', default: false })
    isRead!: boolean
}
