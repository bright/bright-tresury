import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../database/base.entity'
import { UserEntity } from '../user.entity'

@Entity('user_web3_addresses')
export class Web3AddressEntity extends BaseEntity {
    @Column({ nullable: false, type: 'text', unique: true })
    address: string

    @ManyToOne(() => UserEntity, (user) => user.web3Addresses)
    user?: UserEntity

    @Column({ nullable: false, type: 'boolean', default: false })
    isPrimary: boolean

    constructor(address: string, isPrimary: boolean, user?: UserEntity) {
        super()
        this.address = address
        this.isPrimary = isPrimary
        this.user = user
    }
}
