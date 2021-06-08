import { BaseEntity } from '../../../database/base.entity'
import { Column, Entity, Generated, ManyToOne, OneToMany } from 'typeorm'
import { IdeaMilestoneNetwork } from './idea-milestone-network.entity'
import { Idea } from '../../entities/idea.entity'
import { Nil } from '../../../utils/types'
import { defaultIdeaMilestoneStatus, IdeaMilestoneStatus } from '../idea-milestone-status'
import { BadRequestException } from '@nestjs/common'
import { EmptyBeneficiaryException } from '../../exceptions/empty-beneficiary.exception'

@Entity('idea_milestones')
export class IdeaMilestone extends BaseEntity {
    @ManyToOne(() => Idea, (idea) => idea.milestones)
    idea: Idea

    @Column({ type: 'integer', generated: 'increment' })
    @Generated('increment')
    ordinalNumber!: number

    @Column({
        type: 'enum',
        enum: IdeaMilestoneStatus,
        default: defaultIdeaMilestoneStatus,
        nullable: false,
    })
    status: IdeaMilestoneStatus

    @Column({ type: 'text' })
    subject: string

    @Column({ nullable: true, type: 'text' })
    beneficiary: Nil<string>

    @Column({ nullable: true, type: 'date' })
    dateFrom: Nil<Date>

    @Column({ nullable: true, type: 'date' })
    dateTo: Nil<Date>

    @OneToMany(() => IdeaMilestoneNetwork, (ideaMilestoneNetwork) => ideaMilestoneNetwork.ideaMilestone, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    networks: IdeaMilestoneNetwork[]

    @Column({ nullable: true, type: 'text' })
    description: Nil<string>

    constructor(
        idea: Idea,
        subject: string,
        status: IdeaMilestoneStatus,
        networks: IdeaMilestoneNetwork[],
        beneficiary: Nil<string>,
        dateFrom: Nil<Date>,
        dateTo: Nil<Date>,
        description: Nil<string>,
    ) {
        super()
        this.idea = idea
        this.subject = subject
        this.status = status
        this.networks = networks
        this.beneficiary = beneficiary
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }

    canTurnIntoProposalOrThrow = () => {
        if (!this.beneficiary) {
            throw new EmptyBeneficiaryException()
        }
        if (this.status === IdeaMilestoneStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea milestone with the given id is already turned into proposal')
        }
    }
}
