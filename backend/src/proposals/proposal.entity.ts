import { Column, Entity } from "typeorm";
import { BaseEntity } from "../database/base.entity";

@Entity("proposals")
export class Proposal extends BaseEntity {
    @Column({ nullable: false })
    title: string

    @Column({ nullable: true, type: "text" })
    content: string | null = null

    constructor(title: string) {
        super();
        this.title = title;
    }
}
