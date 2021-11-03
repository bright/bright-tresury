import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../database/base.entity'
import { v4 as uuid } from 'uuid'
import { Web3AddressEntity } from './web3-addresses/web3-address.entity'

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ nullable: false, type: 'text', unique: true })
    authId: string

    @Column({ nullable: false, type: 'text', unique: true })
    username: string

    @Column({ nullable: false, type: 'text', unique: true })
    email: string

    @Column({ nullable: false, type: 'boolean' })
    isEmailPasswordEnabled: boolean

    @OneToMany(() => Web3AddressEntity, (web3Address) => web3Address.user, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    web3Addresses?: Web3AddressEntity[]

    @Column({ nullable: false, type: 'boolean', default: true })
    isEmailNotificationEnabled: boolean

    constructor(
        authId: string,
        username: string,
        email: string,
        isEmailPasswordEnabled: boolean,
        web3Addresses?: Web3AddressEntity[],
        id?: string,
        isEmailNotificationEnabled: boolean = true,
    ) {
        super()
        this.authId = authId
        this.username = username
        this.email = email
        this.isEmailPasswordEnabled = isEmailPasswordEnabled
        this.web3Addresses = web3Addresses
        this.id = id ?? uuid()
        this.isEmailNotificationEnabled = isEmailNotificationEnabled
    }
}
