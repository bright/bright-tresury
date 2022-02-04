import { Nil } from './types'
import { UserStatus } from '../auth/AuthContext'

export interface AuthorDto {
    userId: string
    web3address: Nil<string>
    username: Nil<string>
    status: UserStatus
}
