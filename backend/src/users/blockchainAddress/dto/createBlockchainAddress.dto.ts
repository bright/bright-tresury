import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateBlockchainAddressDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string

    @ApiProperty({description: 'Authorization core id.'})
    @IsNotEmpty()
    address: string

    @ApiProperty()
    @IsNotEmpty()
    isPrimary: boolean

    constructor(
        userId: string,
        address: string,
        isPrimary: boolean
    ) {
        this.address = address
        this.userId = userId
        this.isPrimary = isPrimary
    }

}
