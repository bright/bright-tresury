import { User } from '../user.entity'

export class CreateBlockchainAddressDto {
    address: string
    user: User

    constructor(address: string, user: User) {
        this.address = address
        this.user = user
    }
}
