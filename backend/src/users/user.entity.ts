import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "../database/base.entity";
import {v4 as uuid} from "uuid"
import {BlockchainAddress} from "./blockchainAddress/blockchainAddress.entity";

@Entity("users")
export class User extends BaseEntity {

    @Column({nullable: false, type: "text", unique: true})
    authId: string

    @Column({nullable: false, type: "text", unique: true})
    username: string

    @Column({nullable: false, type: "text", unique: true})
    email: string

    @Column({nullable: false, type: "boolean"})
    isEmailPasswordEnabled: boolean

    @OneToMany(
        () => BlockchainAddress,
        (blockchainAddress) => blockchainAddress.user,
        {
            cascade: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    )
    blockchainAddresses?: BlockchainAddress[];

    constructor(
        authId: string,
        username: string,
        email: string,
        isEmailPasswordEnabled: boolean,
        blockchainAddresses?: BlockchainAddress[],
        id?: string
    ) {
        super()
        this.authId = authId
        this.username = username
        this.email = email
        this.isEmailPasswordEnabled = isEmailPasswordEnabled
        this.blockchainAddresses = blockchainAddresses
        this.id = id ?? uuid()
    }
}
