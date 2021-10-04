import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { User } from '../../users/user.entity'
import { AppEvent } from './app-event.entity'

@Entity('app_event_receivers')
export class AppEventReceiver extends BaseEntity {
    @ManyToOne(() => AppEvent)
    appEvent?: AppEvent

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user!: User

    @Column({ nullable: false, type: 'text' })
    userId!: string

    @Column({ nullable: false, type: 'boolean', default: false })
    isRead!: boolean
}
