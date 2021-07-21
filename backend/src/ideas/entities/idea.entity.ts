import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Column, Entity, Generated, ManyToOne, OneToMany } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { BaseEntity } from '../../database/base.entity'
import { IdeaProposalDetails } from '../../idea-proposal-details/idea-proposal-details.entity'
import { User } from '../../users/user.entity'
import { IdeaMilestone } from '../idea-milestones/entities/idea-milestone.entity'
import { DefaultIdeaStatus, IdeaStatus } from '../idea-status'
import { IdeaNetwork } from './idea-network.entity'
import { EmptyBeneficiaryException } from '../exceptions/empty-beneficiary.exception'

@Entity('ideas')
export class Idea extends BaseEntity {
    @Column({ nullable: true, type: 'text' })
    beneficiary?: string

    @OneToMany(() => IdeaNetwork, (network) => network.idea, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    networks: IdeaNetwork[]

    @Column({ nullable: false, type: 'integer', generated: 'increment' })
    @Generated('increment')
    ordinalNumber!: number

    @Column({
        type: 'enum',
        enum: IdeaStatus,
        default: DefaultIdeaStatus,
        nullable: false,
    })
    status: IdeaStatus

    @ManyToOne(() => User)
    owner?: User

    @Column({ nullable: false, type: 'text' })
    ownerId!: string

    @OneToMany(() => IdeaMilestone, (ideaMilestone) => ideaMilestone.idea, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    milestones?: IdeaMilestone[]

    @ManyToOne(() => IdeaProposalDetails, { eager: true })
    details: IdeaProposalDetails

    constructor(
        networks: IdeaNetwork[],
        status: IdeaStatus,
        owner: User,
        details: IdeaProposalDetails,
        beneficiary?: string,
        id?: string,
    ) {
        super()
        this.networks = networks
        this.status = status
        this.beneficiary = beneficiary
        this.id = id ?? uuid()
        this.owner = owner
        this.details = details
    }

    canEdit = (user: User) => {
        return this.ownerId === user.id
    }

    canEditOrThrow = (user: User) => {
        if (!this.canEdit(user)) {
            throw new ForbiddenException('The given user has no access to this idea')
        }
    }

    canGet = (user?: User) => {
        return this.status !== IdeaStatus.Draft || this.ownerId === user?.id
    }

    canGetOrThrow = (user?: User) => {
        if (!this.canGet(user)) {
            throw new NotFoundException('There is no idea with such id')
        }
    }

    canTurnIntoProposalOrThrow = () => {
        if (!this.beneficiary) {
            throw new EmptyBeneficiaryException()
        }
        if ([IdeaStatus.TurnedIntoProposal, IdeaStatus.TurnedIntoProposalByMilestone].includes(this.status)) {
            throw new BadRequestException(
                `Idea with the given id or at least one of it's milestones is already turned into proposal`,
            )
        }
    }

    canTurnMilestoneIntoProposalOrThrow = () => {
        if (this.status === IdeaStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea with the given id is already turned into proposal')
        }
    }
}
