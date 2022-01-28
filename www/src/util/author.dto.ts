import { Nil } from './types'
import { UserStatus } from '../../../backend/src/users/entities/user-status'

export interface AuthorDto {
    userId: string
    web3address: Nil<string>
    username: Nil<string>
    status: UserStatus
}
