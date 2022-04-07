import { isNil, Nil } from './types'
import { AuthContextUser, UserStatus } from '../auth/AuthContext'

export interface PublicUserDto {
    userId?: Nil<string>
    web3address?: Nil<string>
    username?: Nil<string>
    status?: Nil<UserStatus>
}

export interface PublicInAppUserDto {
    userId: string
    web3address?: Nil<string>
    username: string
    status: UserStatus
}

export const isPublicInAppUserDto = (dto: PublicUserDto | PublicInAppUserDto): dto is PublicInAppUserDto => {
    return !isNil(dto.userId) && !isNil(dto.status) && !isNil(dto.username)
}

export const fromAuthContextUser = (user: AuthContextUser): PublicUserDto => ({
    userId: user.id,
    web3address: user.web3Addresses.find((web3Address) => web3Address.isPrimary)?.encodedAddress,
    username: user.username,
    status: user.status,
})
