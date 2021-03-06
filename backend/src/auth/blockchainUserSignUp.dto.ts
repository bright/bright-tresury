import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class BlockchainUserSignUpDto {
    @ApiProperty({description: 'Blockchain address of a blockchain user.'})
    @IsNotEmpty()
    address!: string

    @ApiProperty({description: 'Blockchain username of a blockchain user.'})
    @IsNotEmpty()
    username!: string

    @ApiProperty({description: 'Blockchain token of a blockchain user.'})
    @IsNotEmpty()
    token!: string
}
