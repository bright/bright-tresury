import { Column, Entity } from "typeorm";
import { BaseEntity } from "../database/base.entity";

@Entity("posts")
export class Post extends BaseEntity {
    @Column({ nullable: false })
    title: string

    @Column({ nullable: true, type: "text" })
    content: string | null = null

    constructor(title: string) {
        super();
        this.title = title;
    }
}
