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

    @Column({ nullable: false, type: 'integer', generated: 'increment'})
    @Generated('increment')
    ordinalNumber!: number

    @Column({ nullable: false, type: 'text' })
    subject: string

    @Column({ nullable: true, type: 'timestamp with time zone' })
    dateFrom?: Date | null

    @Column({ nullable: true, type: 'timestamp with time zone' })
    dateTo?: Date | null

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
    description?: string | null

    constructor(
        idea: Idea,
        subject: string,
        networks: IdeaMilestoneNetwork[],
        dateFrom?: Date | null,
        dateTo?: Date | null,
        description?: string | null
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
