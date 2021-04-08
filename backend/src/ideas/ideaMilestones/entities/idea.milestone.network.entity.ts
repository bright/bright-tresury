import {BaseEntity} from "../../../database/base.entity";
import {Column, Entity, ManyToOne} from "typeorm";
import {IdeaMilestone} from "./idea.milestone.entity";

@Entity('idea_milestone_networks')
export class IdeaMilestoneNetwork extends BaseEntity {

    @ManyToOne(
        () => IdeaMilestone,
        (ideaMilestone) => ideaMilestone.networks
    )
    ideaMilestone!: IdeaMilestone

    @Column({ nullable: false, type: 'text' })
    name: string

    @Column("decimal", { precision: 39, scale: 15, nullable: false, default: 0 })
    value: number

    constructor(name: string, value: number) {
        super();
        this.name = name
        this.value = value
    }
}
