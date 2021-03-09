import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @ApiProperty({description: 'Authorization core id.'})
    @IsNotEmpty()
    authId: string

    @ApiProperty()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsNotEmpty()
    email: string

    constructor(
        authId: string,
        username: string,
        email: string,
    ) {
        this.authId = authId
        this.username = username
        this.email = email
    }

}
