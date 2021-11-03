import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { ExtrinsicEntity } from '../../extrinsics/extrinsic.entity'
import { defaultIdeaNetworkStatus, IdeaNetworkStatus } from './idea-network-status'
import { IdeaEntity } from './idea.entity'
import { NetworkPlanckValue } from '../../utils/types'

@Entity('idea_networks')
export class IdeaNetworkEntity extends BaseEntity {
    @Column({ nullable: false })
    name: string

    @Column('decimal', { precision: 54, scale: 0, nullable: false, default: 0 })
    value: NetworkPlanckValue

    @ManyToOne(() => IdeaEntity, (idea) => idea.networks)
    idea?: IdeaEntity

    @OneToOne(() => ExtrinsicEntity)
    @JoinColumn()
    extrinsic: ExtrinsicEntity | null

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
        value: NetworkPlanckValue = '0' as NetworkPlanckValue,
        status: IdeaNetworkStatus = defaultIdeaNetworkStatus,
        extrinsic = null,
        blockchainProposalId = null,
        idea?: IdeaEntity,
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
