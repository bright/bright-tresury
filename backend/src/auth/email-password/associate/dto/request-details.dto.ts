import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class EmailPasswordAssociateRequestDetails {
    @ApiProperty({ description: 'Email address' })
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @ApiProperty({ description: 'Username' })
    @IsNotEmpty()
    username!: string

    @ApiProperty({ description: 'Password' })
    @IsNotEmpty()
    password!: string
}
