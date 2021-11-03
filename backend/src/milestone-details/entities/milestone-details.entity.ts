import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { Nil } from '../../utils/types'

@Entity('milestone_details')
export class MilestoneDetailsEntity extends BaseEntity {
    @Column({ type: 'text' })
    subject!: string

    @Column({ nullable: true, type: 'date' })
    dateFrom: Nil<Date>

    @Column({ nullable: true, type: 'date' })
    dateTo: Nil<Date>

    @Column({ nullable: true, type: 'text' })
    description: Nil<string>
}
