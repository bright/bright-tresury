import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../../../database/base.entity'
import { Extrinsic } from '../../../extrinsics/extrinsic.entity'
import { defaultIdeaNetworkStatus } from '../../entities/idea-network-status'
import { defaultIdeaMilestoneNetworkStatus, IdeaMilestoneNetworkStatus } from './idea-milestone-network-status'
import { IdeaMilestone } from './idea-milestone.entity'

@Entity('idea_milestone_networks')
export class IdeaMilestoneNetwork extends BaseEntity {
    @ManyToOne(() => IdeaMilestone, (ideaMilestone) => ideaMilestone.networks)
    ideaMilestone?: IdeaMilestone

    @Column({ type: 'text' })
    name: string

    @Column('decimal', { precision: 39, scale: 15, nullable: false, default: 0 })
    value: number

    @OneToOne(() => Extrinsic)
    @JoinColumn()
    extrinsic: Extrinsic | null

    @Column({ nullable: true, type: 'integer' })
    blockchainProposalId: number | null

    @Column({
        type: 'enum',
        enum: IdeaMilestoneNetworkStatus,
        default: defaultIdeaNetworkStatus,
        nullable: false,
    })
    status: IdeaMilestoneNetworkStatus

    constructor(
        name: string,
        value: number,
        extrinsic = null,
        blockchainProposalId = null,
        status = defaultIdeaMilestoneNetworkStatus,
    ) {
        super()
        this.name = name
        this.value = value
        this.extrinsic = extrinsic
        this.blockchainProposalId = blockchainProposalId
        this.status = status
    }

    canEditOrThrow = () => {
        if (this.status === IdeaMilestoneNetworkStatus.TurnedIntoProposal) {
            throw new ForbiddenException(
                `This idea milestone network is already turned into proposal and you cannot edit it`,
            )
        }
    }

    canTurnIntoProposalOrThrow = () => {
        if (Number(this.value) === 0) {
            throw new BadRequestException(
                'Value of the idea milestone network with the given id has to be greater than zero',
            )
        }
    }
}
