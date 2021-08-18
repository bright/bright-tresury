import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { Extrinsic } from '../../extrinsics/extrinsic.entity'
import { defaultIdeaNetworkStatus, IdeaNetworkStatus } from './idea-network-status'
import { Idea } from './idea.entity'

@Entity('idea_networks')
export class IdeaNetwork extends BaseEntity {
    @Column({ nullable: false })
    name: string

    @Column('decimal', { precision: 39, scale: 15, nullable: false, default: 0 })
    value: number

    @ManyToOne(() => Idea, (idea) => idea.networks)
    idea?: Idea

    @OneToOne(() => Extrinsic)
    @JoinColumn()
    extrinsic: Extrinsic | null

    @Column({ nullable: true, type: 'integer' })
    blockchainProposalId: number | null

    @Column({
        type: 'enum',
        enum: IdeaNetworkStatus,
        default: defaultIdeaNetworkStatus,
        nullable: false,
    })
    status: IdeaNetworkStatus

    constructor(
        name: string,
        value: number = 0,
        status: IdeaNetworkStatus = defaultIdeaNetworkStatus,
        extrinsic = null,
        blockchainProposalId = null,
        idea?: Idea,
    ) {
        super()
        this.name = name
        this.value = value
        this.extrinsic = extrinsic
        this.blockchainProposalId = blockchainProposalId
        this.idea = idea
        this.status = status
    }

    canEditOrThrow = () => {
        if (this.status === IdeaNetworkStatus.TurnedIntoProposal) {
            throw new ForbiddenException(`This idea network is already turned into proposal and you cannot edit it`)
        }
    }

    canTurnIntoProposalOrThrow = () => {
        if (Number(this.value) === 0) {
            throw new BadRequestException('Value of the idea network with the given id has to be greater than zero')
        }
        if (this.status === IdeaNetworkStatus.TurnedIntoProposal) {
            throw new BadRequestException(`Idea with the given id is already turned into proposal in this network`)
        }
    }
}
