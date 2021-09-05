import { ForbiddenException } from '@nestjs/common'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { IdeaProposalDetails } from '../../idea-proposal-details/idea-proposal-details.entity'
import { IdeaNetwork } from '../../ideas/entities/idea-network.entity'
import { IdeaMilestoneNetwork } from '../../ideas/idea-milestones/entities/idea-milestone-network.entity'
import { User } from '../../users/user.entity'
import { Nil } from '../../utils/types'
import { ProposalMilestone } from '../proposal-milestones/entities/proposal-milestone.entity'
import { IdeaComment } from '../../ideas/idea-comments/entities/idea-comment.entity'
import { ProposalComment } from '../proposal-comments/entities/proposal-comment.entity'

@Entity('proposals')
export class Proposal extends BaseEntity {
    @ManyToOne(() => User)
    owner: Nil<User>

    @Column({ nullable: false, type: 'text' })
    ownerId!: string

    @OneToOne(() => IdeaProposalDetails, { eager: true })
    @JoinColumn()
    details: IdeaProposalDetails

    @OneToOne(() => IdeaNetwork)
    @JoinColumn()
    ideaNetwork?: Nil<IdeaNetwork>

    @Column({ nullable: true, type: 'text' })
    ideaNetworkId?: Nil<string>

    @OneToOne(() => IdeaMilestoneNetwork)
    @JoinColumn()
    ideaMilestoneNetwork?: Nil<IdeaMilestoneNetwork>

    @Column({ nullable: true, type: 'text' })
    ideaMilestoneNetworkId?: Nil<string>

    @Column({ nullable: false, type: 'text' })
    networkId: string

    @Column({ nullable: false, type: 'integer' })
    blockchainProposalId: number

    @OneToMany(() => IdeaComment, (ideaComment) => ideaComment.idea, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    comments: ProposalComment[]

    @OneToMany(() => ProposalMilestone, (milestone) => milestone.proposal, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    milestones?: ProposalMilestone[]

    constructor(
        owner: User,
        details: IdeaProposalDetails,
        ideaNetwork: IdeaNetwork,
        ideaMilestoneNetwork: IdeaMilestoneNetwork,
        networkId: string,
        blockchainProposalId: number,
        comments: ProposalComment[],
    ) {
        super()
        this.networkId = networkId
        this.owner = owner
        this.details = details
        this.ideaNetwork = ideaNetwork
        this.ideaMilestoneNetwork = ideaMilestoneNetwork
        this.blockchainProposalId = blockchainProposalId
        this.comments = comments
    }

    isOwner(user: User) {
        return this.ownerId === user.id
    }

    isOwnerOrThrow = (user: User) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit this proposal')
        }
    }
}
