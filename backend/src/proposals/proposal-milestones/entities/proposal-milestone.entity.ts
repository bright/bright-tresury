import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../../../database/base.entity'
import { MilestoneDetailsEntity } from '../../../milestone-details/entities/milestone-details.entity'
import { ProposalEntity } from '../../entities/proposal.entity'

@Entity('proposal_milestones')
export class ProposalMilestoneEntity extends BaseEntity {
    @ManyToOne(() => ProposalEntity, (proposal) => proposal.milestones)
    proposal!: ProposalEntity

    @Column({ nullable: false, type: 'text' })
    proposalId!: string

    @OneToOne(() => MilestoneDetailsEntity, { eager: true })
    @JoinColumn()
    details!: MilestoneDetailsEntity
}
