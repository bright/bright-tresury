import { ForbiddenException } from '@nestjs/common'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { IdeaProposalDetailsEntity } from '../../idea-proposal-details/idea-proposal-details.entity'
import { IdeaNetworkEntity } from '../../ideas/entities/idea-network.entity'
import { IdeaMilestoneNetworkEntity } from '../../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { UserEntity } from '../../users/entities/user.entity'
import { Nil } from '../../utils/types'
import { ProposalMilestoneEntity } from '../proposal-milestones/entities/proposal-milestone.entity'

@Entity('proposals')
export class ProposalEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, { eager: true })
    owner: Nil<UserEntity>

    @Column({ nullable: false, type: 'text' })
    ownerId!: string

    @OneToOne(() => IdeaProposalDetailsEntity, { eager: true })
    @JoinColumn()
    details: IdeaProposalDetailsEntity

    @OneToOne(() => IdeaNetworkEntity)
    @JoinColumn()
    ideaNetwork?: Nil<IdeaNetworkEntity>

    @Column({ nullable: true, type: 'text' })
    ideaNetworkId?: Nil<string>

    @OneToOne(() => IdeaMilestoneNetworkEntity)
    @JoinColumn()
    ideaMilestoneNetwork?: Nil<IdeaMilestoneNetworkEntity>

    @Column({ nullable: true, type: 'text' })
    ideaMilestoneNetworkId?: Nil<string>

    @Column({ nullable: false, type: 'text' })
    networkId: string

    @Column({ nullable: false, type: 'integer' })
    blockchainProposalId: number

    @OneToMany(() => ProposalMilestoneEntity, (milestone) => milestone.proposal, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    milestones?: ProposalMilestoneEntity[]

    constructor(
        owner: UserEntity,
        details: IdeaProposalDetailsEntity,
        ideaNetwork: IdeaNetworkEntity,
        ideaMilestoneNetwork: IdeaMilestoneNetworkEntity,
        networkId: string,
        blockchainProposalId: number,
    ) {
        super()
        this.networkId = networkId
        this.owner = owner
        this.details = details
        this.ideaNetwork = ideaNetwork
        this.ideaMilestoneNetwork = ideaMilestoneNetwork
        this.blockchainProposalId = blockchainProposalId
    }

    isOwner(user: UserEntity) {
        return this.ownerId === user.id
    }

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this proposal')
        }
    }
}
