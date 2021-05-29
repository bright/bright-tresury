import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateWeb3UserDto {
    @ApiProperty({ description: 'Authorization core id.' })
    @IsNotEmpty()
    authId!: string

    @ApiProperty()
    @IsNotEmpty()
    username!: string

    @ApiProperty()
    @IsNotEmpty()
    web3Address!: string

    constructor(authId: string, username: string, web3Address: string) {
        this.authId = authId
        this.username = username
        this.web3Address = web3Address
    }
}
