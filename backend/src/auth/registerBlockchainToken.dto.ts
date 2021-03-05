import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class RegisterBlockchainTokenDto {
    @ApiProperty({description: 'Blockchain address of a blockchain user.'})
    @IsNotEmpty()
    token!: string
}
