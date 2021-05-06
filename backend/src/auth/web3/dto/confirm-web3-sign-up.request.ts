import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class ConfirmWeb3SignUpRequest {
    @ApiProperty({description: 'Blockchain address used for sign up'})
    @IsNotEmpty()
    address!: string

    @ApiProperty({description: 'Network used for signing the message'})
    @IsNotEmpty()
    network!: string

    @ApiProperty({description: 'Message signature'})
    @IsNotEmpty()
    signature!: string
}
