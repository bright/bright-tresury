import {Column, Entity, Generated, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "../../database/base.entity";
import {User} from "../users/user.entity";
import {IdeaNetwork} from "./ideaNetwork.entity";
import {v4 as uuid} from 'uuid';
import {DefaultIdeaStatus, IdeaStatus} from "../ideaStatus";
import {IdeaMilestone} from "../ideaMilestones/entities/idea.milestone.entity";

export const ideaRestrictions = {
    field: {
        maxLength: 255
    }
}

@Entity("ideas")
export class Idea extends BaseEntity {
    @Column({nullable: false})
    title: string

    @Column({nullable: true, type: "text"})
    content?: string

    @Column({nullable: true, type: "text"})
    beneficiary?: string

    @Column({
        nullable: true,
        type: "text"
    })
    field?: string

    @OneToMany(
        () => IdeaNetwork,
        (network) => network.idea,
        {
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    networks: IdeaNetwork[]

    @Column({nullable: true, type: "text"})
    contact?: string

    @Column({nullable: true, type: "text"})
    portfolio?: string

    @Column({nullable: true, type: "text"})
    links?: string

    @Column({nullable: false, type: "integer", generated: "increment"})
    @Generated('increment')
    ordinalNumber!: number

    @Column({
        type: "enum",
        enum: IdeaStatus,
        default: DefaultIdeaStatus,
        nullable: false
    })
    status: IdeaStatus

    @ManyToOne(() => User)
    owner?: User

    @Column({nullable: false, type: "text"})
    ownerId!: string

    @OneToMany(
        () => IdeaMilestone,
        (ideaMilestone) => ideaMilestone.idea,
        {
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    milestones?: IdeaMilestone[]

    constructor(
        title: string,
        networks: IdeaNetwork[],
        status: IdeaStatus,
        owner: User,
        beneficiary?: string,
        content?: string,
        field?: string,
        contact?: string,
        portfolio?: string,
        links?: string,
        id?: string,
    ) {
        super()
        this.title = title
        this.networks = networks
        this.status = status
        this.beneficiary = beneficiary
        this.content = content
        this.field = field
        this.contact = contact
        this.portfolio = portfolio
        this.links = links
        this.id = id ?? uuid()
        this.owner = owner
    }
}
