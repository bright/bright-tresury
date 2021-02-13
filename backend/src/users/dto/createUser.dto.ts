import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @ApiProperty({description: 'Authorization core id.'})
    @IsNotEmpty()
    id!: string

    @ApiProperty()
    @IsNotEmpty()
    username!: string

    @ApiProperty()
    @IsNotEmpty()
    email!: string
}
