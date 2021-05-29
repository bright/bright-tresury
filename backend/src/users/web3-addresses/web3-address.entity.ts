import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { User } from '../user.entity'

@Entity('user_web3_addresses')
export class Web3Address extends BaseEntity {
    @Column({ nullable: false, type: 'text', unique: true })
    address: string

    @ManyToOne(() => User, (user) => user.web3Addresses)
    user?: User

    @Column({ nullable: false, type: 'boolean', default: false })
    isPrimary: boolean

    constructor(address: string, user: User, isPrimary: boolean) {
        super()
        this.address = address
        this.user = user
        this.isPrimary = isPrimary
    }
}
