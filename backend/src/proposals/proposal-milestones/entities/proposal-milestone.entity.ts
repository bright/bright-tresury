import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../../../database/base.entity'
import { MilestoneDetails } from '../../../milestone-details/entities/milestone-details.entity'
import { Proposal } from '../../entities/proposal.entity'

@Entity('proposal_milestones')
export class ProposalMilestone extends BaseEntity {
    @ManyToOne(() => Proposal, (proposal) => proposal.milestones)
    proposal!: Proposal

    @Column({ nullable: false, type: 'text' })
    proposalId!: string

    @Column({ type: 'integer' })
    ordinalNumber!: number

    @OneToOne(() => MilestoneDetails, { eager: true })
    @JoinColumn()
    details!: MilestoneDetails
}
