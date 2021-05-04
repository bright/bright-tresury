import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../database/base.entity";
import { Extrinsic } from "../../extrinsics/extrinsic.entity";
import { Idea } from "./idea.entity";
import { BadRequestException } from '@nestjs/common'

@Entity("idea_networks")
export class IdeaNetwork extends BaseEntity {
    @Column({ nullable: false })
    name: string

    @Column('decimal', { precision: 39, scale: 15, nullable: false, default: 0 })
    value: number

    @ManyToOne(
        () => Idea,
        (idea) => idea.networks
    )
    idea?: Idea

    @OneToOne(() => Extrinsic)
    @JoinColumn()
    extrinsic: Extrinsic | null

    @Column({ nullable: true, type: "integer", })
    blockchainProposalId: number | null

    constructor(name: string, value: number = 0, extrinsic = null, blockchainProposalId = null) {
        super();
        this.name = name
        this.value = value
        this.extrinsic = extrinsic
        this.blockchainProposalId = blockchainProposalId
    }

    canTurnIntoProposalOrThrow = () => {
        if (this.value === 0) {
            throw new BadRequestException('Value of the idea network with the given id has to be greater than zero')
        }
    }
}
