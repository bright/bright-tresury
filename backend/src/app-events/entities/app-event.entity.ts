import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { Nil } from '../../utils/types'
import { AppEventReceiver } from './app-event-receiver.entity'
import { AppEventData } from './app-event-type'

@Entity('app_events')
export class AppEvent extends BaseEntity {
    @Column({ nullable: false, type: 'json' })
    data!: AppEventData

    @OneToMany(() => AppEventReceiver, (receiver) => receiver.appEvent, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    receivers?: Nil<AppEventReceiver[]>
}
