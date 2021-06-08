import { BaseEntity } from '../../../database/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { IdeaMilestone } from './idea-milestone.entity'
import { Extrinsic } from '../../../extrinsics/extrinsic.entity'
import { BadRequestException } from '@nestjs/common'

@Entity('idea_milestone_networks')
export class IdeaMilestoneNetwork extends BaseEntity {
    @ManyToOne(() => IdeaMilestone, (ideaMilestone) => ideaMilestone.networks)
    ideaMilestone!: IdeaMilestone

    @Column({ type: 'text' })
    name: string

    @Column('decimal', { precision: 39, scale: 15, nullable: false, default: 0 })
    value: number

    @OneToOne(() => Extrinsic)
    @JoinColumn()
    extrinsic: Extrinsic | null

    @Column({ nullable: true, type: 'integer' })
    blockchainProposalId: number | null

    constructor(name: string, value: number, extrinsic = null, blockchainProposalId = null) {
        super()
        this.name = name
        this.value = value
        this.extrinsic = extrinsic
        this.blockchainProposalId = blockchainProposalId
    }

    canTurnIntoProposalOrThrow = () => {
        if (Number(this.value) === 0) {
            throw new BadRequestException(
                'Value of the idea milestone network with the given id has to be greater than zero',
            )
        }
    }
}
