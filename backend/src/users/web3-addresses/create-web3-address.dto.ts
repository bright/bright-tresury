import { UserEntity } from '../entities/user.entity'

export class CreateWeb3AddressDto {
    address: string
    user: UserEntity

    constructor(address: string, user: UserEntity) {
        this.address = address
        this.user = user
    }
}
