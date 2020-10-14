import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { Proposal } from "./proposal.entity";

@Entity("proposal_networks")
export class ProposalNetwork extends BaseEntity {
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false, type: "integer", default: 0 })
    value: number

    @ManyToOne(
        () => Proposal,
        (proposal) => proposal.networks
      )
      proposal: Proposal

    constructor(name: string, proposal: Proposal, value: number = 0) {
        super();
        this.name = name;
        this.proposal = proposal;
        this.value = value;
    }
}
