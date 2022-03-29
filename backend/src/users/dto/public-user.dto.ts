import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserStatus } from '../entities/user-status'
import { UserEntity } from '../entities/user.entity'
import { Nil } from '../../utils/types'

export class PublicUserDto {
    @ApiProperty({ description: 'User Id' })
    userId?: string
    @ApiPropertyOptional({ description: 'Username' })
    username?: string
    @ApiPropertyOptional({ description: 'Primary web3 address of the user' })
    web3address?: string
    @ApiPropertyOptional({ description: 'User status' })
    status?: string

    constructor({
        userId,
        username,
        web3address,
        status,
    }: {
        userId?: string
        username?: string
        web3address?: string
        status?: UserStatus
    }) {
        this.userId = userId
        this.username = username
        this.web3address = web3address
        this.status = status
    }
    static fromUserEntity = (userEntity: Nil<UserEntity>): PublicUserDto => {
        return new PublicUserDto({
            userId: userEntity?.id,
            username: userEntity?.username,
            status: userEntity?.status,
            web3address: userEntity?.web3Addresses?.find((web3address) => web3address.isPrimary)?.address,
        })
    }
}
