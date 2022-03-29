import { Nil } from './types'
import { AuthContextUser, UserStatus } from '../auth/AuthContext'

export interface PublicUserDto {
    userId?: Nil<string>
    web3address?: Nil<string>
    username?: Nil<string>
    status?: Nil<UserStatus>
}

export const fromAuthContextUser = (user: AuthContextUser): PublicUserDto => ({
    userId: user.id,
    web3address: user.web3Addresses.find((web3Address) => web3Address.isPrimary)?.encodedAddress,
    username: user.username,
    status: user.status,
})
