import { Nil } from './types'
import { AuthContextUser, UserStatus } from '../auth/AuthContext'

export interface AuthorDto {
    userId: string
    web3address?: Nil<string>
    username?: Nil<string>
    status: UserStatus
}

export const fromAuthContextUser = (user: AuthContextUser): AuthorDto => ({
    userId: user.id,
    web3address: user.web3Addresses.find((web3Address) => web3Address.isPrimary)?.encodedAddress,
    username: user.username,
    status: user.status,
})
