import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from '../../../users/user.entity'
import { Nil } from '../../../utils/types'
import { InternalServerErrorException } from '@nestjs/common'

export class IdeaCommentAuthorDto {
    @ApiProperty({ description: 'User Id' })
    userId: string
    @ApiPropertyOptional({ description: 'Username of the user who create the comment' })
    username?: string
    @ApiPropertyOptional({ description: 'Primary web3 address of the user who create the comment' })
    web3address?: string
    @ApiProperty({ description: 'True if user signed up with email&password, False if web3 account was used' })
    isEmailPasswordEnabled: boolean

    constructor(author: Nil<User>) {
        if (!author) throw new InternalServerErrorException('Author is not defined')
        this.userId = author.id
        this.username = author.username
        this.web3address = author.web3Addresses?.find((web3Address) => web3Address.isPrimary)?.address
        this.isEmailPasswordEnabled = author.isEmailPasswordEnabled
    }
}
