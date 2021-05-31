import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateWeb3UserDto {
    @ApiProperty({ description: 'Authorization core id of the new user' })
    @IsNotEmpty()
    authId!: string

    @ApiProperty({ description: 'Username of the new user' })
    @IsNotEmpty()
    username!: string

    @ApiProperty({ description: 'Web3 address of the new user' })
    @IsNotEmpty()
    web3Address!: string

    constructor(authId: string, username: string, web3Address: string) {
        this.authId = authId
        this.username = username
        this.web3Address = web3Address
    }
}
