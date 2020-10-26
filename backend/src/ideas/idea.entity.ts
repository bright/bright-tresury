import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { IdeaNetwork } from "./ideaNetwork.entity";

@Entity("ideas")
export class Idea extends BaseEntity {
    @Column({ nullable: false })
    title: string

    @Column({ nullable: true, type: "text" })
    content: string | null = null

    @Column({ nullable: true, type: "text" })
    beneficiary: string | null = null

    @OneToMany(
        () => IdeaNetwork,
        (network) => network.idea
    )
    networks?: IdeaNetwork[]

    constructor(title: string, content: string | null = null, beneficiary: string | null = null) {
        super()
        this.title = title
        this.content = content
        this.beneficiary = beneficiary
    }
}
