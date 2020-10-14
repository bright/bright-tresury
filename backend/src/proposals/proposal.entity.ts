import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { ProposalNetwork } from "./proposalNetwork.entity";

@Entity("proposals")
export class Proposal extends BaseEntity {
    @Column({ nullable: false })
    title: string

    @Column({ nullable: true, type: "text" })
    content: string | null = null

    @OneToMany(
        () => ProposalNetwork,
        (network) => network.proposal
    )
    networks?: ProposalNetwork[]

    constructor(title: string) {
        super();
        this.title = title;
    }
}
