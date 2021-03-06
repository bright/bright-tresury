import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateBlockchainUserDto {
    @ApiProperty({description: 'Authorization core id.'})
    @IsNotEmpty()
    authId!: string

    @ApiProperty()
    @IsNotEmpty()
    username!: string

    @ApiProperty()
    @IsNotEmpty()
    blockchainAddress!: string

    constructor(
        authId: string,
        username: string,
        blockchainAddress: string,
    ) {
        this.authId = authId
        this.username = username
        this.blockchainAddress = blockchainAddress
    }

}
