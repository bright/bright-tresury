import {Column, Entity} from "typeorm";
import {BaseEntity} from "../database/base.entity";
import {v4 as uuid} from "uuid"

@Entity("users")
export class User extends BaseEntity {

    @Column({nullable: false, type: "text", unique: true})
    authId: string

    @Column({nullable: false, type: "text", unique: true})
    username: string

    @Column({nullable: false, type: "text", unique: true})
    email: string

    constructor(
        authId: string,
        username: string,
        email: string,
        id?: string
    ) {
        super()
        this.authId = authId
        this.username = username
        this.email = email
        this.id = id ?? uuid()
    }
}
