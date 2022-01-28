import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserEntity } from '../users/entities/user.entity'
import { Nil } from './types'
import { InternalServerErrorException } from '@nestjs/common'

export class AuthorDto {
    @ApiProperty({ description: 'User Id' })
    userId: string
    @ApiPropertyOptional({ description: 'Username' })
    username?: string
    @ApiPropertyOptional({ description: 'Primary web3 address of the user' })
    web3address?: string
    @ApiProperty({ description: 'True if user signed up with email&password, False if web3 account was used' })
    status: string

    constructor(author: Nil<UserEntity>) {
        if (!author) throw new InternalServerErrorException('Author is not defined')
        this.userId = author.id
        this.username = author.username
        this.web3address = author.web3Addresses?.find((web3Address) => web3Address.isPrimary)?.address
        this.status = author.status
    }
}
