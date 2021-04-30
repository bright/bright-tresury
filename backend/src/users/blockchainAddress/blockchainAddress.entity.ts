import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "../../database/base.entity";
import {User} from "../user.entity";

@Entity("user_blockchain_address")
export class BlockchainAddress extends BaseEntity {

    @Column({nullable: false, type: "text", unique: true})
    address: string

    @ManyToOne(() => User, (user) => user.blockchainAddresses)
    user: User;

    @Column({nullable: false, type: "boolean", default: false})
    isPrimary: boolean

    constructor(
        address: string,
        user: User,
        isPrimary: boolean
    ) {
        super()
        this.address = address
        this.user = user
        this.isPrimary = isPrimary
    }
}
