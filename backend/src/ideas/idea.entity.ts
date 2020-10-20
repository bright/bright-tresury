import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { IdeaNetwork } from "./ideaNetwork.entity";

@Entity("ideas")
export class Idea extends BaseEntity {
    @Column({ nullable: false })
    title: string

    @Column({ nullable: true, type: "text" })
    content: string | null = null

    @OneToMany(
        () => IdeaNetwork,
        (network) => network.idea
    )
    networks?: IdeaNetwork[]

    constructor(_title: string) {
        super()
           console.log('title :>> ', _title);
        this.title = _title
        console.log('this :>> ', this)
    }
}
