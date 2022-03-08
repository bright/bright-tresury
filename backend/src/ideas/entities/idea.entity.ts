import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { BaseEntity } from '../../database/base.entity'
import { IdeaProposalDetailsEntity } from '../../idea-proposal-details/idea-proposal-details.entity'
import { UserEntity } from '../../users/entities/user.entity'
import { EmptyBeneficiaryException } from '../exceptions/empty-beneficiary.exception'
import { IdeaMilestoneEntity } from '../idea-milestones/entities/idea-milestone.entity'
import { IdeaNetworkStatus } from './idea-network-status'
import { IdeaNetworkEntity } from './idea-network.entity'
import { DefaultIdeaStatus, IdeaStatus } from './idea-status'
import { Nil } from '../../utils/types'

@Entity('ideas')
export class IdeaEntity extends BaseEntity {
    @Column({ nullable: true, type: 'text' })
    beneficiary?: string

    @OneToMany(() => IdeaNetworkEntity, (network) => network.idea, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true,
    })
    networks: IdeaNetworkEntity[]

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

    @ManyToOne(() => UserEntity)
    owner?: UserEntity

    @Column({ nullable: false, type: 'text' })
    ownerId!: string

    @OneToMany(() => IdeaMilestoneEntity, (ideaMilestone) => ideaMilestone.idea, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    milestones?: IdeaMilestoneEntity[]

    @OneToOne(() => IdeaProposalDetailsEntity, { eager: true })
    @JoinColumn()
    details: IdeaProposalDetailsEntity

    constructor(
        networks: IdeaNetworkEntity[],
        status: IdeaStatus,
        owner: UserEntity,
        details: IdeaProposalDetailsEntity,
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

    isDraft = (): boolean => this.status === IdeaStatus.Draft

    isOwner = (user: UserEntity) => {
        return this.ownerId === user.id
    }

    isOwnerOrThrow = (user: UserEntity) => {
        if (!this.isOwner(user)) {
            throw new ForbiddenException('The given user cannot edit or delete this idea')
        }
    }

    canEditOrThrow = (user: UserEntity) => {
        this.isOwnerOrThrow(user)
        if (this.status === IdeaStatus.TurnedIntoProposal || this.status === IdeaStatus.MilestoneSubmission) {
            throw new BadRequestException('The given user cannot edit or delete this idea')
        }
    }

    canEditMilestonesOrThrow = (user: UserEntity) => {
        this.isOwnerOrThrow(user)
        if (this.status === IdeaStatus.TurnedIntoProposal) {
            throw new BadRequestException('The given user cannot edit this ideas milestones')
        }
    }

    canGet = (user?: UserEntity) => {
        return this.status !== IdeaStatus.Draft || this.ownerId === user?.id
    }

    canGetOrThrow = (user?: UserEntity) => {
        if (!this.canGet(user)) {
            throw new NotFoundException('There is no idea with such id')
        }
    }

    canTurnIntoProposalOrThrow = () => {
        if (!this.beneficiary) {
            throw new EmptyBeneficiaryException()
        }
        if (
            this.status === IdeaStatus.MilestoneSubmission ||
            (this.status === IdeaStatus.TurnedIntoProposal &&
                this.networks.every((n) => n.status === IdeaNetworkStatus.TurnedIntoProposal))
        ) {
            throw new BadRequestException(
                `Idea with the given id or at least one of it's milestones is already turned into proposal`,
            )
        }
        if (this.status === IdeaStatus.Draft) {
            throw new BadRequestException(
                `Idea cannot be turned into a proposal because an idea has status ${IdeaStatus.Draft}`,
            )
        }
    }

    canTurnMilestoneIntoProposalOrThrow = () => {
        if (this.status === IdeaStatus.TurnedIntoProposal) {
            throw new BadRequestException('Idea with the given id is already turned into proposal')
        }
        if (this.status === IdeaStatus.Draft) {
            throw new BadRequestException("You cannot turn draft idea's milestones into proposal")
        }
    }
}
