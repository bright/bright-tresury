import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../database/base.entity";
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

    constructor(name: string, idea: Idea, value: number = 0) {
        super();
        this.name = name;
        this.idea = idea;
        this.value = value;
    }
}
