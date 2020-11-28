import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "../database/base.entity";
import {IdeaNetwork} from "./ideaNetwork.entity";
import {v4 as uuid} from 'uuid';

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
            cascade: true
        }
    )
    networks: IdeaNetwork[]

    @Column({nullable: true, type: "text"})
    contact?: string

    @Column({nullable: true, type: "text"})
    portfolio?: string

    @Column({nullable: true, type: "text"})
    links?: string

    constructor(
        title: string,
        networks: IdeaNetwork[],
        beneficiary?: string,
        content?: string,
        field?: string,
        contact?: string,
        portfolio?: string,
        links?: string,
        id?: string
    ) {
        super()
        this.title = title
        this.content = content
        this.beneficiary = beneficiary
        this.field = field
        this.networks = networks
        this.contact = contact
        this.portfolio = portfolio
        this.links = links
        this.id = id ?? uuid()
    }
}
