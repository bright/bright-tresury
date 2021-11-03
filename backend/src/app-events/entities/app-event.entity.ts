import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { Nil } from '../../utils/types'
import { AppEventReceiverEntity } from './app-event-receiver.entity'
import { AppEventData } from './app-event-type'

@Entity('app_events')
export class AppEventEntity extends BaseEntity {
    @Column({ nullable: false, type: 'json' })
    data!: AppEventData

    @OneToMany(() => AppEventReceiverEntity, (receiver) => receiver.appEvent, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    receivers?: Nil<AppEventReceiverEntity[]>
}
