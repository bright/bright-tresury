import { BaseEntity } from '../../../database/base.entity'
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { IdeaProposalDetails } from '../../../idea-proposal-details/idea-proposal-details.entity'
import { MilestoneDetails } from '../../../milestone-details/entities/milestone-details.entity'
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

    @Column({ nullable: false, type: 'text' })
    ideaId!: string

    @Column({ type: 'integer' })
    ordinalNumber: number

    @Column({
        type: 'enum',
        enum: IdeaMilestoneStatus,
        default: defaultIdeaMilestoneStatus,
        nullable: false,
    })
    status: IdeaMilestoneStatus

    @Column({ nullable: true, type: 'text' })
    beneficiary: Nil<string>

    @OneToMany(() => IdeaMilestoneNetwork, (ideaMilestoneNetwork) => ideaMilestoneNetwork.ideaMilestone, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    networks: IdeaMilestoneNetwork[]

    @OneToOne(() => MilestoneDetails, { eager: true })
    @JoinColumn()
    details: MilestoneDetails

    constructor(
        idea: Idea,
        status: IdeaMilestoneStatus,
        networks: IdeaMilestoneNetwork[],
        details: MilestoneDetails,
        beneficiary?: Nil<string>,
    ) {
        super()
        this.idea = idea
        this.status = status
        this.networks = networks
        this.beneficiary = beneficiary
        this.ordinalNumber = 0
        this.details = details
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
