import {BaseEntity} from "../../../database/base.entity";
import {Column, Entity, Generated, ManyToOne, OneToMany} from "typeorm";
import {IdeaMilestoneNetwork} from "./idea.milestone.network.entity";
import {Idea} from "../../entities/idea.entity";

@Entity('idea_milestones')
export class IdeaMilestone extends BaseEntity {

    @ManyToOne(
        () => Idea,
        (idea) => idea.milestones
    )
    idea: Idea

    @Column({ type: 'integer', generated: 'increment'})
    @Generated('increment')
    ordinalNumber!: number

    @Column({ type: 'text' })
    subject: string

    @Column({ nullable: true, type: 'date' })
    dateFrom?: Date

    @Column({ nullable: true, type: 'date' })
    dateTo?: Date

    @OneToMany(
        () => IdeaMilestoneNetwork,
        (ideaMilestoneNetwork) => ideaMilestoneNetwork.ideaMilestone,
        {
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    networks: IdeaMilestoneNetwork[]

    @Column({ nullable: true, type: 'text'})
    description?: string

    constructor(
        idea: Idea,
        subject: string,
        networks: IdeaMilestoneNetwork[],
        dateFrom?: Date,
        dateTo?: Date,
        description?: string
    ) {
        super();
        this.idea = idea
        this.subject = subject
        this.networks = networks
        this.dateFrom = dateFrom
        this.dateTo = dateTo
        this.description = description
    }
}
