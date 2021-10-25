import { BadRequestException } from '@nestjs/common'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../../../database/base.entity'
import { MilestoneDetails } from '../../../milestone-details/entities/milestone-details.entity'
import { Nil } from '../../../utils/types'
import { Idea } from '../../entities/idea.entity'
import { EmptyBeneficiaryException } from '../../exceptions/empty-beneficiary.exception'
import { IdeaMilestoneNetwork } from './idea-milestone-network.entity'
import { defaultIdeaMilestoneStatus, IdeaMilestoneStatus } from './idea-milestone-status'
import { IdeaMilestoneNetworkStatus } from './idea-milestone-network-status'

@Entity('idea_milestones')
export class IdeaMilestone extends BaseEntity {
    @ManyToOne(() => Idea, (idea) => idea.milestones)
    idea: Idea

    @Column({ nullable: false, type: 'text' })
    ideaId!: string

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
        eager: true,
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
        this.details = details
    }

    canEdit = (): boolean => {
        return this.status !== IdeaMilestoneStatus.TurnedIntoProposal
    }
    canEditOrThrow = () => {
        if (!this.canEdit()) {
            throw new BadRequestException('You cannot edit idea milestone with the given id')
        }
    }
    canTurnIntoProposalOrThrow = () => {
        if (!this.beneficiary) {
            throw new EmptyBeneficiaryException()
        }
        const allNetworksTurnedIntoProposal = this.networks.reduce(
            (acc, cur) => acc && cur.status === IdeaMilestoneNetworkStatus.TurnedIntoProposal,
            true,
        )
        if (allNetworksTurnedIntoProposal)
            throw new BadRequestException('All idea milestone networks are already turned into proposal')
    }
}
