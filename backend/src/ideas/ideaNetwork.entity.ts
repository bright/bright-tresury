import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { Extrinsic } from "../extrinsics/extrinsic.entity";
import { Idea } from "./idea.entity";

@Entity("idea_networks")
export class IdeaNetwork extends BaseEntity {
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false, type: "integer", default: 0 })
    value: number

    @ManyToOne(
        () => Idea,
        (idea) => idea.networks
    )
    idea: Idea

    @OneToOne(() => Extrinsic)
    @JoinColumn()
    extrinsic: Extrinsic | null

    @Column({ nullable: true, type: "integer", })
    blockchainProposalId: number | null

    constructor(name: string, idea: Idea, value: number = 0, extrinsic = null, blockchainProposalId = null) {
        super();
        this.name = name
        this.idea = idea
        this.value = value
        this.extrinsic = extrinsic
        this.blockchainProposalId = blockchainProposalId
    }
}
